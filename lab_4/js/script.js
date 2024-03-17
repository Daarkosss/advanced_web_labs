$('#accordionEx').on('shown.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.rotate-icon').addClass('fa-rotate-180');
});
  
$('#accordionEx').on('hidden.bs.collapse', function (e) {
    $(e.target).prev('.card-header').find('.rotate-icon').removeClass('fa-rotate-180');
});
  