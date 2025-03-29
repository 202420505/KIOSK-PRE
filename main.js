const firebaseConfig = {
    apiKey: "AIzaSyBsUla3VNIn6wccJ43Ui5Dzw9mwIAHcdKE",
    authDomain: "auth.appwebsite.tech",
    databaseURL: "https://treeentertainment-default-rtdb.firebaseio.com",
    projectId: "treeentertainment",
    storageBucket: "treeentertainment.appspot.com",
    messagingSenderId: "302800551840",
    appId: "1:302800551840:web:1f7ff24b21ead43cc3eec5"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();    
const realtimeDb = firebase.database();
var email = JSON.parse(window.localStorage.getItem('email'));
var number = JSON.parse(window.localStorage.getItem('number'));
var name = JSON.parse(window.localStorage.getItem('name'));
const user = firebase.auth().currentUser;

function logout() {
  firebase.auth().signOut().then(() => {
    window.localStorage.clear();
    window.location.href = "index.html";
  }).catch((error) => {
    console.log(error);
  });
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var originalEmail = user.email;
        var fixedemail = originalEmail.replace(".", "@");

        window.localStorage.setItem('email', JSON.stringify(fixedemail));

        firebase.database().ref('/people/admin/' + fixedemail).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data && data.enabled === true) {

            firebase.database().ref('/people/data/' + data.store).once('value').then((snapshot) => {
              const data = snapshot.val();
              if (data && data.email === fixedemail) {
                window.localStorage.setItem('name', JSON.stringify(data.name));
            } else {
                window.location.href = "index.html"; // 로그인 페이지로 이동
              }
            });
  
          } else {
            window.location.href = "index.html"; // 로그인 페이지로 이동
        }
      });    
    } else {
      console.log("사용자 없음, 로그인 페이지로 이동");
      window.location.href = "index.html"; // 로그인 페이지로 이동
    }
  });
    
  function updatePage() {
      let hash = location.hash.substring(1) || "all"; // 기본값 "all"

      // 모든 페이지 숨기기
      document.querySelectorAll('.page').forEach(page => {
          page.classList.remove('active');
      });

      // 현재 해시에 맞는 페이지 표시
      let activePage = document.getElementById(hash);
      if (activePage) {
          activePage.classList.add('active');
      }

      document.querySelectorAll('.tabs ul li').forEach(li => {
        li.classList.remove('is-active');
    });

    // 현재 해시와 일치하는 <a> 태그 찾기
    let activeLink = document.querySelector(`.tabs ul li a[href="#${hash}"]`);
    
    // <a> 태그가 존재하면, 해당 <a>의 부모 <li>에 is-active 추가
    if (activeLink) {
        activeLink.parentElement.classList.add('is-active');
    }
  }

  window.addEventListener("hashchange", updatePage);
  window.addEventListener("load", updatePage);

  function getOrder() {
    return JSON.parse(localStorage.getItem('order')) || [];
  }

  document.addEventListener("DOMContentLoaded", display);

  function display() {

    window.localStorage.removeItem('order');
    firebase.database().ref('/people/data/' + number + '/menu').once('value').then((snapshot) => {
      const allcontent = document.getElementById("all-content");
      const drinkscontent = document.getElementById("drinks-content");
      const foodscontent = document.getElementById("foods-content");
      drinkscontent.innerHTML = ''; // Clear existing content
      foodscontent.innerHTML = ''; // Clear existing content  
      allcontent.innerHTML = ''; // Clear existing content
  
      snapshot.val().cafe.drinks.forEach((drink) => {
        const cellBox = document.createElement('div');
        cellBox.className = 'cell box boxes';

        cellBox.onclick = function() {
          selectoption(drink);
        };

        const figure = document.createElement('figure');
        figure.className = 'image is-128x128 blurred-img';
  
        const img = document.createElement('img');
        img.src = drink.image;
        img.style.width = '128px';
        img.style.height = '128px';
        img.style.objectFit = 'cover';

        img.addEventListener('load', function() {
          figure.classList.add("loaded");
        });

      const center = document.createElement('center');
        center.appendChild(img);


        const br = document.createElement('br');
        center.appendChild(br);

        
        const strong = document.createElement('strong');
        strong.textContent = drink.name;
        center.appendChild(strong);

        const br2 = document.createElement('br');
        center.appendChild(br2); 

        const price = document.createElement('strong');
        price.textContent = drink.price + "원";
        center.appendChild(price);

        const br3 = document.createElement('br');
  
        center.appendChild(br3); 
  
        if (drink.option && drink.option.some(option => option.name.includes('HOT/ICE'))) {
          const hot = document.createElement('span');
          hot.className = 'tag is-danger';
          hot.textContent = 'HOT';
          center.appendChild(hot);
          const devide = document.createElement('strong');
          devide.textContent = " / ";

          center.appendChild(devide);
          const ice = document.createElement('span');
          ice.className = 'tag is-success';
          ice.textContent = 'ICE';
          center.appendChild(ice);
        }
        
        center.appendChild(figure);

        
        cellBox.appendChild(center);
        const cellbox2 = cellBox.cloneNode(true);
        cellbox2.onclick = function() {
          selectoption(drink);
        };
        allcontent.appendChild(cellbox2);

        drinkscontent.appendChild(cellBox);
      });
  
      snapshot.val().cafe.foods.forEach((food) => {
        const cellBox = document.createElement('div');
        cellBox.className = 'cell box boxes';
  
        
        cellBox.onclick = function() {
          selectoption(food);
        };

        const figure = document.createElement('figure');
        figure.className = 'image is-128x128';
  
        const img = document.createElement('img');
        img.src = food.image;
        img.style.width = '128px';
        img.style.height = '128px';
        img.style.objectFit = 'cover';
  
        const center = document.createElement('center');
        center.appendChild(img);

        const br = document.createElement('br');
  
        center.appendChild(br);
        const strong = document.createElement('strong');
        strong.textContent = food.name;
  
        center.appendChild(strong);
  
        const br2 = document.createElement('br');
  
        center.appendChild(br2);

        if (food.option && food.option.some(option => option.name.includes('HOT/ICE'))) {
          const hot = document.createElement('span');
          hot.className = 'tag is-danger';
          hot.textContent = 'HOT';
          center.appendChild(hot);
          
          const devide = document.createElement('strong');
          devide.textContent = " / ";

          center.appendChild(devide);
          
          const ice = document.createElement('span');
          ice.className = 'tag is-success';
          ice.textContent = 'ICE';
          center.appendChild(ice);
        }
  
        center.appendChild(figure);
        cellBox.appendChild(center);
        const cellbox2 = cellBox.cloneNode(true);
        cellbox2.onclick = function() {
          selectoption(food);
        };
        allcontent.appendChild(cellbox2);
        foodscontent.appendChild(cellBox);
      });
    });
  }

  function selectoption(data) {
    const optionform = document.getElementById('optionform');

    const optioncontent = document.getElementById('optioncontent');
    for (const key in optionform.dataset) {
      delete optionform.dataset[key];
    }
    optioncontent.innerHTML = ''; // Clear existing content
    const center = document.createElement('center');

    const figure = document.createElement('figure');
    const image = document.createElement('img');

    image.className = 'image is-128x128';
    image.style.width = '128px';  
    image.style.height = '128px';
    image.style.objectFit = 'cover';
    image.src = data.image;
    image.id = 'optionimg';
    figure.appendChild(image);
    center.appendChild(figure);

    const title = document.createElement('h1');
    title.className = 'title';  
    title.textContent = data.name;
    center.appendChild(title);

    const subtitle = document.createElement('h2');
    subtitle.className = 'subtitle';    
    subtitle.id = 'optionprice';
    subtitle.textContent = data.price;
    center.appendChild(subtitle);
    
    optionform.dataset.id = data.key;
    optionform.dataset.max = data.max;
    optionform.dataset.option = JSON.stringify(data.option);

    if (data.option) {
      for (let i = 0; i < data.option.length; i++) {
        if (data.option[i].type === "radio") {
          const container = document.createElement('div');
          container.className = 'field';
          container.id = "radio-" + data.option[i].key;

          const labels = document.createElement('label');
          labels.className = 'label'; 
          labels.textContent = data.option[i].name;
          container.appendChild(labels);  

          const containerr = document.createElement('div');
          containerr.className = 'buttons has-addons is-centered';
          for (let j = 0; j < data.option[i].options.length; j++) {
            const button = document.createElement('button');
            button.className = `button ${data.option[i].color[j]} is-normal button-group`;
            button.textContent = data.option[i].options[j].toUpperCase();
            if(j === data.option[i].default){
              button.classList.add('is-focused');
            }
            button.onclick = function(event) {
              event.preventDefault(); // 폼 제출 방지         
              document.querySelectorAll('.button-group').forEach(button => {
                button.classList.remove('is-focused'); // 모든 버튼의 is-selected 클래스 제거
              });
              button.classList.add('is-focused');
            };
            containerr.appendChild(button);
        }

        
        container.appendChild(containerr);
        center.appendChild(container);

      }
        if (data.option[i].type === "range") {
          const field0 = document.createElement('div');
          field0.className = 'field';

          const labels = document.createElement('label');
          labels.className = 'label';
          labels.textContent = data.option[i].name;
        
          field0.appendChild(labels);

          const field = document.createElement('div');
          field.className = 'field has-addons has-addons-centered';
          field.id = "range-" + data.option[i].key;

          const control1 = document.createElement('p');
          control1.className = 'control';

          const minusButton = document.createElement('button');
          minusButton.className = 'button is-primary';
          minusButton.textContent = '-';
          control1.appendChild(minusButton);
        
          const control2 = document.createElement('p');
          control2.className = 'control';
        
          const inputs = document.createElement('input');
          inputs.className = 'input';
          inputs.type = 'number';
          inputs.min = data.option[i].min;

          if(data.option[i].max != null) {
          inputs.max = data.option[i].max;
          }

          inputs.onchange = function() {
            if(inputs.value > data.option[i].max && data.option[i].max != null) {
              inputs.value =  data.option[i].max;      
              inputs.max =  data.option[i].max;      
    
            }
          };

          inputs.value = 0;
          inputs.classList.add('optionquantity');
          inputs.placeholder = '수량';

          control2.appendChild(inputs);

          const control3 = document.createElement('p');
          control3.className = 'control';
        
          const plusButton = document.createElement('button');
          plusButton.className = 'button is-primary';
          plusButton.textContent = '+';
          control3.appendChild(plusButton);

          field.appendChild(control1);
          field.appendChild(control2);
          field.appendChild(control3);
                
          // Add event listeners for the buttons
          minusButton.addEventListener('click', (event) => {
            event.preventDefault(); // 폼 제출 방지
          
            let currentValue = parseInt(inputs.value) || 0;
            if (currentValue > 0) {
              inputs.value = currentValue - 1;
              subtitle.textContent = Number(subtitle.textContent) - Number(data.option[i].price);
            }
          });
        
          plusButton.addEventListener('click', (event) => {
            event.preventDefault(); // 폼 제출 방지
    
            let currentValue = parseInt(inputs.value) || 0;
    
            if (currentValue < data.option[i].max || data.option[i].max === "null") {
              inputs.value = currentValue + 1;
              subtitle.textContent = Number(subtitle.textContent) + Number(data.option[i].price);
            }

            
          });
        
          center.appendChild(field0);
          center.appendChild(field);
        }
      }
      
    }
      const field0 = document.createElement('div');
      field0.className = 'field';

      const labels = document.createElement('label');
      labels.className = 'label';
      labels.textContent = "수량";

      field0.appendChild(labels);


      const field = document.createElement('div');
      field.className = 'field has-addons has-addons-centered';
    
      const control1 = document.createElement('p');
      control1.className = 'control';
    
      const minusButton = document.createElement('button');
      minusButton.className = 'button is-primary';
      minusButton.textContent = '-';
      control1.appendChild(minusButton);
    
      const control2 = document.createElement('p');
      control2.className = 'control';
    
      const inputs = document.createElement('input');
      inputs.className = 'input optionquantity';
      inputs.type = 'number';
      inputs.min = 1;

      const existingIndex = getItemIndex(data.key.toString()); // Check if item exists based on id and options
      var order = getOrder(); // Get the latest order
      console.log(data.key);
      console.log(existingIndex);
      var maxvalue = data.max;

      if(existingIndex !== -1) {
        maxvalue = data.max - order[existingIndex].quantity;

        console.log(maxvalue);
        if (maxvalue <= 0) { // 0 이하일 때만 max를 0으로 설정
          isfull();
          return;
        } else {
          inputs.max = maxvalue;
        }
        
      } else {
        if(maxvalue != null) {
        inputs.max = data.max;
        }
      }

      
      inputs.onchange = function() {
        console.log(inputs.value);
        if(inputs.value > maxvalue) {
          inputs.value = maxvalue;      
          inputs.max = maxvalue;      
        }
      };


      inputs.value = 1;
      inputs.id = 'optionquantity';
      inputs.placeholder = '수량';
      control2.appendChild(inputs);
    
      const control3 = document.createElement('p');
      control3.className = 'control';
    
      const plusButton = document.createElement('button');
      plusButton.className = 'button is-primary';
      plusButton.textContent = '+';
      control3.appendChild(plusButton);
    
      // Add controls to the field container
      field.appendChild(control1);
      field.appendChild(control2);
      field.appendChild(control3);
    
      // Append to a parent container, for example, a div with id 'all-content'
      document.getElementById('all-content').appendChild(field);
    
      // Add event listeners for the buttons
      minusButton.addEventListener('click', (event) => {
        event.preventDefault(); // 폼 제출 방지

        let currentValue = parseInt(inputs.value) || 0;
        if (currentValue > 1) {
          inputs.value = currentValue - 1;
          subtitle.textContent = Number(subtitle.textContent) - Number(data.price);
        }
      });
    
      plusButton.addEventListener('click', (event) => {
        event.preventDefault(); // 폼 제출 방지

        let currentValue = parseInt(inputs.value) || 0;

        if (currentValue < maxvalue || maxvalue === "null") {
          inputs.value = currentValue + 1;
          subtitle.textContent = Number(subtitle.textContent) + Number(data.price);
        }
      });
    
      center.appendChild(field0);
      center.appendChild(field);

      optioncontent.appendChild(center);

      openModal(document.getElementById('optionpage'));
  }  


  function isfull() {
    const optionform = document.getElementById('optionform');
    const optioncontent = document.getElementById('optioncontent');
    optioncontent.innerHTML = ''; // Clear existing content

    const center = document.createElement('center');
    const title = document.createElement('h1');

    title.className = 'title';
    title.textContent = "최대 주문 개수를 초과하였습니다.";
    center.appendChild(title);
    optioncontent.appendChild(center);

    var optionbuttons = document.getElementById('submitbutton');
    optionbuttons.style.display = 'none';

    openModal(document.getElementById('optionpage'));
  }


    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape") {
        closeAllModals();
      }
    });

  function addorder() {
    const form = document.getElementById('optionform');
    const itemId = form.dataset.id;
    const max = form.dataset.max;
    const description = document.querySelector('#optionform .subtitle')?.innerText;
    const image = document.querySelector('#optionimg').src;
    const price = Number(document.querySelector('#optionform .subtitle').textContent);
    const quantity = Number(document.querySelector('#optionquantity').value);
    let jsons; 
    try {
      jsons = JSON.parse(form.dataset.option);
    } catch (error) {
      jsons = [];
    }
    
    var newjsons = [];

    console.log(jsons.length);
    for(let i = 0; i < jsons.length; i++) {

      if(jsons[i].type === "radio") {
        const optionele = document.querySelector(`#radio-${jsons[i].key}`);
        var values = optionele.querySelector(".is-focused").innerText;
      } else if(jsons[i].type === "range") {
        const optionele = document.querySelector(`#range-${jsons[i].key}`);
        var values = optionele.querySelector(".optionquantity").value;
      }

      newjsons.push({ name: jsons[i].name, value: values });
    };

    addItemToOrder({ id: itemId, description, image, price, quantity, options: newjsons, max });  
    displayorders();
    closeModal(document.getElementById('optionpage'));
  }

  function addItemToOrder({ id, image, description, price, quantity, options, max }) {
    const existingIndex = getItemIndex(id); // Check if item exists based on id and options
    let order = getOrder(); // Get the latest order

    if (existingIndex !== -1) {
        // Update existing item: add quantity and recalculate total price
        order[existingIndex].quantity += quantity;
        order[existingIndex].price = order[existingIndex].pricePerUnit * order[existingIndex].quantity;
    } else {
        // Add new item: Store price per unit for future calculations
        order.push({ id, image, description, quantity, price: price * quantity, pricePerUnit: price, options, max });
    }

    console.log(order);
    localStorage.setItem('order', JSON.stringify(order)); // Save to localStorage
  }

  // Get item index based on id and options (first match by id, then by options)
  function getItemIndex(id) {
  let order = getOrder(); // Get the latest order
  return order.findIndex(item => item.id === id);
  }
  

document.getElementById("optionform").addEventListener("submit", function(event) {
  event.preventDefault(); // 기본 제출 동작 방지
  addorder();
});


function displayorders() {
  let order = getOrder(); // 최신 값 가져오기
  const menupan = document.getElementById('menupan');
  menupan.innerHTML = ''; // 기존 내용 초기화

  const container = document.createElement('div');
  container.className = 'child';
  container.style.display = 'flex';
  container.style.flexWrap = 'nowrap';
  container.style.overflowX = 'auto'; // 가로 스크롤 가능하도록 설정

  order.forEach(item => {
      const cellBox = document.createElement('div');
      cellBox.className = 'box boxes menupan';
      cellBox.style.flexShrink = '0'; // 크기 유지
      cellBox.style.width = '500px'; // 요소 크기 조정
      cellBox.style.height = '110px';
      cellBox.style.margin = '5px';

      // 이미지 & 수량 조절을 가로 정렬
      const center = document.createElement('div');
      center.className = 'center';

      // 이미지 영역
      const figure = document.createElement('figure');
      figure.className = 'image';
      const img = document.createElement('img');
      img.src = item.image;
      img.style.width = '200px';
      img.style.height = '100px';
      img.style.borderRadius = '30px';
      img.style.objectFit = 'cover';

      figure.appendChild(img);
      center.appendChild(figure); // 이미지 추가

      // HOT/ICE 배지 (이미지 아래)
      item.options.forEach(option => {
          if (option.name.includes('HOT/ICE')) {
              const tag = document.createElement('span');
              tag.className = option.value === 'HOT' ? 'tag is-rounded is-danger' : 'tag is-rounded is-success';
              tag.classList.add('badge');

              tag.textContent = option.value;
              center.appendChild(tag);
          }
      });


      // 수량 조절 필드 (이미지 오른쪽)
      const field = document.createElement('div');
      field.className = 'field has-addons has-addons-centered basket';

      const control1 = document.createElement('p');
      control1.className = 'control';

      const minusButton = document.createElement('button');
      minusButton.className = 'button is-primary';
      minusButton.textContent = '-';
      control1.appendChild(minusButton);

      const control2 = document.createElement('p');
      control2.className = 'control';

      const inputs = document.createElement('input');
      inputs.className = 'input';
      inputs.type = 'number';
      inputs.min = 1;
      if (item.max != null) {
          inputs.max = item.max;
      }
      inputs.addEventListener('input', function() {
          enforceMinMax(this);
      });

      inputs.value = item.quantity;
      control2.appendChild(inputs);

      const control3 = document.createElement('p');
      control3.className = 'control';

      const plusButton = document.createElement('button');
      plusButton.className = 'button is-primary';
      plusButton.textContent = '+';
      control3.appendChild(plusButton);

      field.appendChild(control1);
      field.appendChild(control2);
      field.appendChild(control3);

      center.appendChild(field); // 수량 조절 필드 추가

      cellBox.appendChild(center); // 전체 묶음 추가

      // 버튼 이벤트 추가
      minusButton.addEventListener('click', (event) => {
          event.preventDefault(); 
          let currentValue = parseInt(inputs.value) || 0;
          if (currentValue > 1) {
              inputs.value = currentValue - 1;
              updatequantity(item.id, currentValue - 1);
          } else if(currentValue === 1) {
            const index = order.findIndex(order => order.id === item.id);
            order.splice(index, 1);
            localStorage.setItem('order', JSON.stringify(order));
            cellBox.remove();
          }
      });

      plusButton.addEventListener('click', (event) => {
          event.preventDefault(); 
          let currentValue = parseInt(inputs.value) || 0;
          if (currentValue < item.max || item.max === "null") {
              inputs.value = currentValue + 1;
              updatequantity(item.id, currentValue + 1);
          }
      });

      container.appendChild(cellBox);
  });

  menupan.appendChild(container);
}



function updatequantity(id, quantity) {
  let order = getOrder(); // 최신 값 가져오기
  const existingIndex = order.findIndex(item => item.id === id); // Check if item exists based on id
  order[existingIndex].quantity = quantity;
  order[existingIndex].price = order[existingIndex].pricePerUnit * quantity;
  localStorage.setItem('order', JSON.stringify(order)); // Save to localStorage
}

function enforceMinMax(el) {
  if (el.value !== "") {
    const value = parseInt(el.value, 10);  // Ensure to parse the value
    const min = parseInt(el.min, 10);      // Parse the min attribute
    const max = parseInt(el.max, 10);      // Parse the max attribute

    if (value < min) {
      el.value = min;  // Set to min if value is less than min
    } else if (value > max) {
      el.value = max;  // Set to max if value is greater than max
    }
  }
}