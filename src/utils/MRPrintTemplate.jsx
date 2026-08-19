const MRPrintTemplate = ({ form, lines, logo }) => `
<html>
<head>
<title>Material Request</title>

<style>

@page{
    size:A4;
    margin:10mm;
}

body{
    font-family:Arial,Helvetica,sans-serif;
    margin:0;
    padding:0;
    color:#000;
}

.container{
    width:100%;
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:10px;
}

.left{
    width:33%;
}

.center{
    width:34%;
    text-align:center;
    align-self:center;
}

.right{
    width:33%;
    text-align:right;
    font-size:12px;
    line-height:18px;
    font-weight:bold;
}

.logo{
    max-width:230px;
    max-height:90px;
}

.title{
    font-size:20px;
    font-weight:bold;
}

.info{
    display:flex;
    justify-content:space-between;
    margin:18px 0;
    font-size:14px;
}

.info-col{
    width:48%;
}

.field{
    margin-bottom:12px;
    display:flex;
}

.label{
    display:inline-block;
    width:110px;
    font-weight:bold;
}

.sep{
    width:12px;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
}

table th{
    border:1px solid #000;
    padding:8px;
    text-align:center;
    font-size:14px;
}

table td{
    border:1px solid #000;
    padding:6px;
    height:26px;
    font-size:13px;
}

.footer{
    display:flex;
    justify-content:space-between;
    margin-top:70px;
}

.footer div{
    width:240px;
    text-align:left;
    font-weight:bold;
    border-top:1px solid #000;
    padding-top:6px;
}

.sign{
    display:flex;
    justify-content:space-between;
    margin-top:80px;
    font-weight:bold;
    font-size:14px;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="left">
${logo ? `<img class="logo" src="${logo}" />` : ''}
</div>

<div class="center">
<div class="title">Material Request</div>
</div>

<div class="right">
<div>Tel : 04-3958771</div>
<div>Fax : 04-3958775</div>
<div>P.o.Box : 119070</div>
<div>Dubai-United Arab Emirates</div>
<div>E-mail : alavon@alavoncontracting.com</div>
</div>

</div>

<div class="info">

<div class="info-col">

<div class="field">
<span class="label">Prjct Name</span>
<span class="sep">:</span>
<span>${form?.ProjectName ?? ''}</span>
</div>

<div class="field">
<span class="label">Job No</span>
<span class="sep">:</span>
<span>${form?.ProjectCode ?? ''}</span>
</div>

</div>

<div class="info-col" style="text-align:right">

<div class="field" style="justify-content:flex-end">
<span class="label" style="width:auto">No</span>
<span class="sep">:</span>
<span>${form?.RequisitionNo ?? ''}</span>
</div>

<div class="field" style="justify-content:flex-end">
<span class="label" style="width:auto">Date</span>
<span class="sep">:</span>
<span>${form?.RequiredDate ?? ''}</span>
</div>

</div>

</div>

<table>

<thead>

<tr>
<th style="width:8%">S.No</th>
<th>Description</th>
<th style="width:15%">Qty</th>
<th style="width:15%">Budget</th>
<th style="width:22%">Remarks</th>
</tr>

</thead>

<tbody>

${(lines ?? [])
  .map(
    (item, index) => `
<tr>
<td align="center">${index + 1}</td>
<td>${item.ItemDescription ?? ''}</td>
<td align="center">${item.ApprovedQuantity ?? ''}</td>
<td></td>
<td>${item.Remark ?? ''}</td>
</tr>
`
  )
  .join('')}

${Array.from({
  length: Math.max(11 - (lines?.length || 0), 0)
})
  .map(
    () => `
<tr>
<td>&nbsp;</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
`
  )
  .join('')}

</tbody>

</table>

<div class="sign">
<div>Prepared By</div>
<div>Site Incharge</div>
</div>

</div>

<script>

window.onload=function(){

window.print();

}

</script>

</body>

</html>
`;

export default MRPrintTemplate;
