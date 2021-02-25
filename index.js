const form = document.querySelector('.form');
const input = document.querySelector('.input');
const errorMessage = document.querySelector('.errorMessage');
const list = document.querySelector('.cities');
const apiKey = 'e8c9e3bf970879716bf489660566ca43';
const dataFromStorage = JSON.parse(localStorage.getItem('data'));

let array = [];

const render = (data, index = array.length -1) => {
  const {
    main, name, sys, weather,
  } = data;
  const icon = `https://openweathermap.org/img/wn/${
    weather[0].icon
  }@2x.png`;

  const li = document.createElement('li');
  li.classList.add('city');
  const output = `
    <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div id="del${index}" data-index="${index}">del</div>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0].description}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>
    `;
  li.innerHTML = output;
  list.appendChild(li);
  const delBtn = document.querySelector(`#del${index}`);
  delBtn.addEventListener('click', onDelete);
};

if (dataFromStorage) {
  array = dataFromStorage;
  array.forEach((item, index) => {
    render(item, index);
  });
}

function onDelete(e) {
  const { index } = e.target.dataset;
  const newArray = array.filter((_, itemIndex) => index != itemIndex);
  document.createElement('li');
  const lis = document.querySelectorAll('li');
  lis.forEach((li) => li.remove());
  newArray.forEach((item, itemIndex) => {
    render(item, itemIndex);
  });
  array = newArray;
  localStorage.setItem('data', JSON.stringify(newArray));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === '404' || data.cod === '400') return;
      array.push(data);
      localStorage.setItem('data', JSON.stringify(array));
      render(data);
    })
    .catch(() => {
      errorMessage.textContent = 'Please search for a valid city 😩';
    });

  errorMessage.textContent = '';
  form.reset();
  input.focus();
});
