const submit = document.getElementById('submit');
const image = document.getElementById('image');

submit.addEventListener('click', () => {
  if (image.value.length == 0) {
    alert('Select Image');
  }
});
