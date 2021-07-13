import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, index } from 'instantsearch.js/es/widgets';
import { connectHits } from 'instantsearch.js/es/connectors';

let appID = 'ZCMWU7GCJV';
let apiKey = 'fa7849a542f5c67f82291aebac55f07e';
const searchClient = algoliasearch(appID, apiKey);
const search = instantsearch({
  indexName: 'products-bc-distinct',
  searchClient,
});

const renderCarousel = ({ widgetParams, hits }, isFirstRender) => {
    const container = document.querySelector(widgetParams.container);
    console.log("hits", hits);

    if (isFirstRender) {
        const carouselUl = document.createElement('ul');
        carouselUl.classList.add('carousel-list-container');
        container.appendChild(carouselUl);
    }

    container.querySelector('ul').innerHTML = hits.map(hit => `
      <li>
          <img src="${hit.image_url}" alt="${hit.product_name}" style="height: 50%; margin-bottom: .5rem">
          <span>${hit.brand_name}</span>
          <a href="#">
            <h3>${hit.product_name}</h3>
          </a>
            <p><span ${
              hit.on_sale ? 'style="text-decoration: line-through"' : ''
            }>$${hit.retail_price}</span> ${
              hit.on_sale ? `<span style="color: red">$${hit.sale_price}</span>` : ''}</p>
      </li>
    `
    ).join('');
};

const carousel = connectHits(renderCarousel);

search.addWidgets([
    index({
        indexName: 'products-bc-distinct_sale_percentage_desc',
        indexId: 'product-best-deals',
    }).addWidgets([
        configure({
            hitsPerPage: 8,
        }),
        carousel({
            container: '#products-best-deals',
        }),
    ]),

    index({
        indexName: 'products-bc-distinct',
        indexId: 'products-osprey-collection',
    }).addWidgets([
        configure({
            hitsPerPage: 8,
            ruleContexts: ['carousel_osprey_collection'],
        }),
        carousel({
            container: '#products-osprey-collection',
        }),
    ]),
    index({
        indexName: 'products-bc-distinct',
        indexId: 'products-car-camping',
    }).addWidgets([
        configure({
            hitsPerPage: 8,
            ruleContexts: ['carousel_car_camping'],
        }),
        carousel({
            container: '#products-car-camping',
        }),
    ]),
]);

search.start();
