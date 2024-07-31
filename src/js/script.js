document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://brandstestowy.smallhost.pl/api/random';
  let pageNumber = 1;
  let pageSize = document.getElementById('itemsPerPage').value || 8;

  const productsContent = document.getElementById('productsContent');
  const loadMoreBtn = document.getElementById('loadMore');
  const modal = document.getElementById('myModal');
  const closeModal = document.getElementById('closeModal');
  const modalName = document.getElementById('modalName');
  const modalValue = document.getElementById('modalValue');

  async function fetchProducts() {
    try {
      console.log(`Fetching products: pageNumber=${pageNumber}, pageSize=${pageSize}`);
      const response = await fetch(`${apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (data.data && data.data.length > 0) {
        data.data.forEach(product => {
          const productElem = document.createElement('article');
          productElem.classList.add('products__item');
          productElem.dataset.id = product.id;
          productElem.innerText = `ID: ${product.id}`;
          productElem.addEventListener('click', () => {
            modalName.innerText = product.name;
            modalValue.innerText = product.value;
            modal.style.display = 'block';
          });
          productsContent.appendChild(productElem);
          console.log('Product element added:', productElem);
        });
        pageNumber++;
      } else {
        console.log('No more products to load');
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      fetchProducts();
    }
  }

  loadMoreBtn.addEventListener('click', fetchProducts);

  document.getElementById('itemsPerPage').addEventListener('change', (e) => {
    pageSize = e.target.value;
    pageNumber = 1;
    productsContent.innerHTML = '';
    fetchProducts();
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('scroll', handleScroll);

  fetchProducts();
});
