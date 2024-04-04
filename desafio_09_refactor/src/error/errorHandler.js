const errorMessages = {
    'productNotFound': 'El producto especificado no se encontró.',
    'invalidInput': 'Los datos proporcionados son inválidos.',
  };
  
  function customErrorMessage(errorType) {
    return errorMessages[errorType] || 'Ha ocurrido un error.';
  }
  
  export default customErrorMessage;
  