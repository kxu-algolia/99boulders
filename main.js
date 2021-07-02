import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits, searchBox, index } from 'instantsearch.js/es/widgets';

import {
    connectHits,
    connectRefinementList,
} from 'instantsearch.js/es/connectors';

let appID = 'ZCMWU7GCJV';
let apiKey = 'fa7849a542f5c67f82291aebac55f07e';

const search = instantsearch({
    indexName: 'products-bc',
    searchClient: algoliasearch(appID, apiKey),
});

// Add the widgets
search.addWidgets([
    searchBox({
        container: '#search-box',
        placeholder: 'Explore articles, products, gyms...',
        showReset: true,
        showSubmit: true,
        showLoadingIndicator: true,
    }),
    index({
        indexName: 'products-bc',
        indexId: 'products',
    }).addWidgets([
        configure({
            hitsPerPage: 9,
        }),
        hits({
            container: '#products',
            templates: {
                empty: 'No results',
                item: `
                  <div class="item">
                      <figure class="hit-image-container">
                        <div class="hit-image-container-box">
                            <img class="hit-image" src="{{image_url}}" alt="">
                        </div>
                        </figure>
                      <p class="hit-category">&#8203;​</p>
                      <div class="item-content">
                          <p class="brand hit-tag">{{{_highlightResult.brand_name.value}}}</p>
                          <p class="name">{{{_highlightResult.product_name.value}}}</p>
                          <div class="hit-description">
                            <p class="retail-price">Retail Price: <b class="hit-currency">$
                            {{{retail_price}}}</p>
                            </b>
                            <p class="sale-price">Sale Price: <b class="hit-currency">$
                            {{{sale_price}}}
                            </p>
                            </b>
                          </div>
                      </div>
                  </div>
                  <br>`,
            },
        }),
    ]),
    index({
        indexName: 'crawler_99boulders',
        indexId: 'blog',
    }).addWidgets([
        configure({
            hitsPerPage: 3,
        }),
        hits({
            container: '#blog',
            templates: {
                empty: 'No results',
                item: `
                  <div class="item row">
                      <figure class="hit-image-container">
                        <div class="hit-image-container-box">
                            <img class="hit-image" src="{{image}}" alt="">
                        </div>
                        </figure>
                      <p class="hit-category">&#8203;​</p>
                      <div class="item-content">
                          <p class="title hit-tag">{{{_highlightResult.title.value}}}</p>
                          <p class="description">{{{_highlightResult.description.value}}}</p>
                      </div>
                  </div>
                  <br>`,
            },
        }),
    ]),
]);

search.start();

// Display and hide box on focus/blur
search.on('render', () => {
    const federatedResults = document.querySelector(
        '.federated-results-container'
    );
    const searchBox = document.querySelector('.ais-SearchBox-wrapper');

    searchBox.querySelector('input').addEventListener('focus', () => {
        federatedResults.style.display = 'grid';
        searchBox.classList.add('is-open');
    });
    window.addEventListener('click', () => {
        federatedResults.style.display = 'none';
    });
    searchBox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    federatedResults.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});
