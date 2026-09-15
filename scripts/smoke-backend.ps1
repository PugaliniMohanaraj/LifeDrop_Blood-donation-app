# LifeDrop backend smoke test
# Expected auth/validation failures (400/403) are treated as PASS when the status matches.

$ErrorActionPreference = 'Continue'
$base = 'http://localhost:8080/api'
$results = [System.Collections.Generic.List[object]]::new()

function Add-Result($name, $status, $code, $detail) {
  $results.Add([PSCustomObject]@{
      Status = $status
      Code   = $code
      Name   = $name
      Detail = $detail
    })
}

function Invoke-Api {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Url,
    [string]$Body = $null,
    [string]$Token = $null,
    [int[]]$Expect = @(200)
  )

  try {
    $headers = @{ 'Content-Type' = 'application/json' }
    if ($Token) { $headers['Authorization'] = "Bearer $Token" }
    $params = @{
      Uri             = $Url
      Method          = $Method
      Headers         = $headers
      UseBasicParsing = $true
      TimeoutSec      = 20
    }
    if ($Body) { $params.Body = $Body }

    $resp = Invoke-WebRequest @params
    $code = [int]$resp.StatusCode
    $snippet = if ($resp.Content.Length -gt 100) { $resp.Content.Substring(0, 100) + '...' } else { $resp.Content }

    if ($Expect -contains $code) {
      Add-Result $Name 'PASS' $code $snippet
    } else {
      Add-Result $Name 'FAIL' $code "Unexpected status (expected $($Expect -join '/')): $snippet"
    }
  } catch {
    $code = $null
    $detail = $_.Exception.Message
    if ($_.Exception.Response) {
      $code = [int]$_.Exception.Response.StatusCode
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
          $reader = [System.IO.StreamReader]::new($stream)
          $detail = $reader.ReadToEnd()
          $reader.Close()
        }
      } catch {}
    }

    if ($null -ne $code -and $Expect -contains $code) {
      $short = if ($detail.Length -gt 100) { $detail.Substring(0, 100) + '...' } else { $detail }
      Add-Result $Name 'PASS' $code "Expected rejection: $short"
    } else {
      Add-Result $Name 'FAIL' $code $detail
    }
  }
}

Write-Host "Running LifeDrop API smoke tests against $base ..."

# Public
Invoke-Api 'GET /health' GET "$base/health"
Invoke-Api 'GET /stats' GET "$base/stats"
Invoke-Api 'GET /public/blood-availability' GET "$base/public/blood-availability"
Invoke-Api 'GET /public/blood-availability/5' GET "$base/public/blood-availability/5"

# Auth success
$loginBody = '{"email":"donor@bloodbridge.com","password":"password123"}'
$loginResp = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 20
$donorToken = $loginResp.token
Add-Result 'POST /auth/login (donor)' 'PASS' 200 "role=$($loginResp.user.role) id=$($loginResp.user.id)"

Invoke-Api 'POST /auth/forgot-password' POST "$base/auth/forgot-password" '{"email":"donor@bloodbridge.com"}'

# Expected rejection — wrong password
Invoke-Api 'POST /auth/login (bad password)' POST "$base/auth/login" '{"email":"donor@bloodbridge.com","password":"wrong"}' -Expect @(400)

# Role logins
foreach ($acct in @(
    @{ e = 'recipient@bloodbridge.com'; r = 'RECIPIENT' },
    @{ e = 'hospital@bloodbridge.com'; r = 'HOSPITAL' },
    @{ e = 'bloodbank@bloodbridge.com'; r = 'BLOOD_BANK' },
    @{ e = 'admin@bloodbridge.com'; r = 'ADMIN' }
  )) {
  try {
    $body = (@{ email = $acct.e; password = 'password123' } | ConvertTo-Json)
    $r = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 20
    if ($r.user.role -eq $acct.r) {
      Add-Result "POST /auth/login ($($acct.r))" 'PASS' 200 "got role=$($r.user.role)"
      Set-Variable -Name "$($acct.r)Token" -Value $r.token
    } else {
      Add-Result "POST /auth/login ($($acct.r))" 'FAIL' 200 "expected $($acct.r), got $($r.user.role)"
    }
  } catch {
    Add-Result "POST /auth/login ($($acct.r))" 'FAIL' $null $_.Exception.Message
  }
}

# Donor authenticated
Invoke-Api 'GET /me (donor)' GET "$base/me" -Token $donorToken
Invoke-Api 'GET /requests (donor)' GET "$base/requests" -Token $donorToken
Invoke-Api 'GET /notifications (donor)' GET "$base/notifications" -Token $donorToken
Invoke-Api 'PATCH /me/availability' PATCH "$base/me/availability" '{"availability":"AVAILABLE"}' -Token $donorToken

# Recipient
Invoke-Api 'GET /requests/mine (recipient)' GET "$base/requests/mine" -Token $RECIPIENTToken
Invoke-Api 'GET /matches (recipient)' GET "$base/matches" -Token $RECIPIENTToken
Invoke-Api 'POST /requests (recipient)' POST "$base/requests" '{"bloodGroup":"O+","units":1,"hospital":"Jaffna Teaching Hospital","location":"Jaffna","requiredDate":"2026-09-25","urgency":"NORMAL","notes":"Smoke test"}' -Token $RECIPIENTToken

# Hospital stock
$hospLogin = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType 'application/json' -Body '{"email":"hospital@bloodbridge.com","password":"password123"}' -TimeoutSec 20
$orgId = $hospLogin.user.organizationId
Invoke-Api 'GET /stock/{orgId} (hospital)' GET "$base/stock/$orgId" -Token $hospLogin.token

# Admin
$adminLogin = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType 'application/json' -Body '{"email":"admin@bloodbridge.com","password":"password123"}' -TimeoutSec 20
Invoke-Api 'GET /admin/organizations' GET "$base/admin/organizations" -Token $adminLogin.token
Invoke-Api 'GET /admin/organizations/pending' GET "$base/admin/organizations/pending" -Token $adminLogin.token

# Expected rejection — missing auth
Invoke-Api 'GET /me (no token)' GET "$base/me" -Expect @(401, 403)

$results | Format-Table -AutoSize Status, Code, Name, Detail
$pass = ($results | Where-Object Status -eq 'PASS').Count
$fail = ($results | Where-Object Status -eq 'FAIL').Count
Write-Host "SUMMARY: $pass PASS, $fail FAIL, $($results.Count) total"
if ($fail -gt 0) { exit 1 } else { exit 0 }
