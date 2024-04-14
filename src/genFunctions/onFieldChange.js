const onFieldChange = (fieldName) => {
  return function (event) {
    FormData[fieldName] = event.target.value;
    setFormData(FormData);
  };
};

export { onFieldChange };
