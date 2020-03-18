using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

$Params = @{
    ResourceGroupName = 'vulcan'
    ResourceType      = 'Microsoft.Web/sites/functions'
    ResourceName      = 'vulcanfunc'
    ApiVersion        = '2015-08-01'
}
Get-AzureRmResource @Params

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = $status
        Body       = $body
    })
