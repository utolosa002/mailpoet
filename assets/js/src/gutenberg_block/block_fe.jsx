import jQuery from 'jquery';

jQuery(($) => {
  $(document).on('submit', '.mailpoet-subs-form', (event) => {
    const formData = $(event.target).serializeArray();
    const message = formData.reduce((acc, item) => {
      return acc + item.name + ": " + (item.value ? item.value : '-') +  "\n";
    }, '');
    alert("TODO: Validation, saving using API \n Form Data: \n" + message);
    return false;
  });
});

