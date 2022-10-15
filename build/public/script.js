const submit = document.getElementById('submit');
const getSubmit = document.getElementById('getSubmit');
const image = document.getElementById('image');
const form = document.getElementById("form");

const width = document.getElementById("width");
const height = document.getElementById("height");


submit.addEventListener('click', () => {
  form.action = `/resize/img/name=test&width=${width.value}&height=${height.value}`;
  
  getSubmit.click();
});
