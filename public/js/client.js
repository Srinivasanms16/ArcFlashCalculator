
  $(function(){
    $("#resultsummary").hide();
    $("#spinner").hide();
    $("#submit").on("click",submitResult);
    $("#Reset").on("click",resetPage);
});

  const submitResult = function(){
    $("#spinner").show();
      let data = {
          UnitOfMeasure:$("#UnitOfMeasure").val(),
          Voltage:$("#Voltage").val(),
          FaultCurrent:$("#FaultCurrent").val(),
          ArchingTime:$("#ArchingTime").val(),
          ArchingTimeForReduced:$("#ArchingTimeForReduced").val(),
          WorkingDistance:$("#WorkingDistance").val(),
          EnclosureWidth:$("#EnclosureWidth").val(),
          EnclosureHeight:$("#EnclosureHeight").val(),
          EnclosureDepth:$("#EnclosureDepth").val(),
          ElectrodeConfiguration:$("#ElectrodeConfiguration").val(),
          ConductorGap:$("#ConductorGap").val()
      }
      
      $.ajax({
          url: '/calculate',
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          crossDomain:true,
          success: function(result) {
              //alert(JSON.stringify(result));
              $("#spinner").hide();
              $("#arccurrent").val(result.ArcCurrent_KA);
              $("#reducedarccurrent").val(result.ReducedArcCurrent_KA);
              $("#incidentEnergy").val(result.IncidentEnergy_calperSquare);
              $("#reducedincidentEnergy").val(result.ReducedIncidentEnergy_calperSquare);
              $("#arcflashboundary").val(result.ArcFlashBoundary_mm);
              $("#reducedarcflashboundary").val(result.ReducedArcFlashBoundary_mm);
              $("#ppecategory").val(result.PPE_Category);
              $("#reducedppecategory").val(result.ReducedPPE_Category);
              $("#resultsummary").show();
          },
          statusCode: {
            500: function() {
              alert( "Input is not proper" );
            }
          }
      });
  }

  const resetPage = function(){
      location.reload();
  }