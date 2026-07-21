const MRPrintTemplate = ({ form,lines }) => `
<html>
<head>
<title>Material Requisition</title>

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
    margin-bottom:20px;
}

.left{
    width:30%;
}

.center{
    width:40%;
    text-align:center;
}

.right{
    width:30%;
    text-align:right;
    font-size:13px;
    line-height:20px;
}

.logo{
    width:70px;
}

.company{
    font-size:28px;
    font-weight:bold;
}

.sub{
    font-size:16px;
    font-weight:bold;
}

.title{
    margin-top:15px;
    font-size:22px;
    text-decoration:underline;
    font-weight:bold;
}

.info{
    display:flex;
    justify-content:space-between;
    margin:20px 0;
}

.left-info{
    width:60%;
}

.right-info{
    width:30%;
}

.field{
    margin-bottom:15px;
}

.label{
    display:inline-block;
    width:120px;
    font-weight:bold;
}

.value{
    border-bottom:1px dotted #000;
    display:inline-block;
    width:250px;
}

.mrno{
    font-size:32px;
    color:red;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
}

table th{
    border:2px solid #000;
    padding:8px;
    text-align:center;
}

table td{
    border:1px solid #000;
    padding:6px;
    height:28px;
}

.footer{
    display:flex;
    justify-content:space-between;
    margin-top:60px;
}

.footer div{
    width:200px;
    text-align:center;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<div class="left">

<!-- Replace with your logo -->


<div class="company">
AL AVON
</div>

<div class="sub">
CONTRACTING (L.L.C.)
</div>

</div>

<div class="center">

<div class="title">
MATERIAL REQUISITION
</div>

</div>

<div class="right">

<div>Tel : 04-3958771</div>
<div>Fax : 04-3958775</div>
<div>P.O.Box : 119070</div>
<div>Dubai UAE</div>
<div>www.alavoncontracting.com</div>

</div>

</div>

<div class="info">

<div class="left-info">

<div class="field">

<span class="label">
Project Name :
</span>

<span class="value">
${form?.ProjectName ?? ''} 
</span>

</div>

<div class="field">

<span class="label">
Doc Entry :
</span>

<span class="value">
${form?.DocEntry ?? ''}
</span>

</div>

</div>

<div class="right-info">

<div>

<b>PO No :</b>

<span class="mrno">
${form?.PONumber ?? ''}
</span>

</div>

<br>

<div>

<b>Date :</b>

${form?.DocDate ?? ''}

</div>

</div>

</div>

<table>

<thead>

<tr>

<th style="width:8%">SL.NO.</th>

<th>DESCRIPTION</th>

<th style="width:10%">UoMCode</th>

<th style="width:15%">BUDGET</th>

<th style="width:15%">REMARKS</th>

</tr>

</thead>

<tbody>

${(lines ?? [])
  .map(
    (item, index) => `

<tr>

<td align="center">${index + 1}</td>

<td>${item.ItemDescription ?? ''}</td>

<td align="center">${item.UoMCode ?? ''}</td>

<td></td>

<td>${item.Remark ?? ''}</td>

</tr>

`
  )
  .join('')}

${Array.from({
  length: Math.max(20 - (lines?.length || 0), 0)
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

<div class="footer">

<div>

Prepared By

</div>

<div>

Site Incharge

</div>

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
