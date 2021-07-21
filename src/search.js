import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import { configure, hits, searchBox, index } from 'instantsearch.js/es/widgets';

import {
    connectHits,
    connectRefinementList,
} from 'instantsearch.js/es/connectors';

const search = instantsearch({
  indexName: 'products-bc-distinct',
  searchClient: algoliasearch(
    'ZCMWU7GCJV',
    'fa7849a542f5c67f82291aebac55f07e'
    )
});

import {
  createInsightsMiddleware,
} from 'instantsearch.js/es/middlewares';

const insightsMiddleware = createInsightsMiddleware({
  insightsClient: aa,
});
search.use(insightsMiddleware);
aa('setUserToken', 'admin');

/**********************************************************
 * Federated search box
 *********************************************************/

search.addWidgets([
  searchBox({
    container: "#search-box",
    placeholder: "Explore articles, products, gyms...",
    showReset: true,
    showSubmit: true,
    showLoadingIndicator: true
  }),
  index({
    indexName: "products-bc-distinct",
    indexId: "products"
  }).addWidgets([
    configure({
      hitsPerPage: 9
    }),
    hits({
        container: '#products',
        templates: {
            item(hit, bindEvent) {

                const badge = hit.sale_percentage ?
                    `<p class="sale-percentage badge">${hit.sale_percentage}% off</p>` : "";

                // show original price (w/ strikethrough) if on sale
                const price = hit.sale_percentage ?
                    `<div class="item-price-container">
                        <p class="item-price">$ ${hit.sale_price} </p>
                        <p class="item-price-strike"><strike>$ ${hit.retail_price}</strike></p>
                    </div>` :
                    `<div class="item-price-container">
                        <p class="item-price">$ ${hit.retail_price}</p>
                    </div>`;

                const product_name = hit.product_name.substring(hit.brand_name.length);

                return `
                    <div class="item">
                        <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                            <img class="item-image" src="${hit.image_url}">
                        </a>
                        ${badge}
                        <p>${hit.brand_name}</p>
                        <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                            <p class="item-product-name">${product_name}</p>
                        </a>
                        ${price}
                    </div>
                    <br>
                `;
            }
        },
      }),
    ]),


  index({
    indexName: "crawler_99boulders",
    indexId: "blog"
  }).addWidgets([
    configure({
      hitsPerPage: 9
    }),
    hits({
      container: "#blog",
        templates: {
            item(hit, bindEvent) {

              console.log("hit", hit);

              const imageUrl = hit.sectionImageUrl ?
                hit.sectionImageUrl : hit.imageUrl;

                return `
                  <div class="item row">
                      <figure class="hit-image-container">
                        <div class="hit-image-container-box">
                            <a href=${hit.url} target="_blank">
                              <img class="item-image-article" src="${imageUrl}" alt="">
                            </a>
                        </div>
                        </figure>
                      <div class="item-content">          
                          <a href=${hit.url} target="_blank">
                          <p class="item-product-name">${instantsearch.highlight({ attribute: 'title', hit })}</p>
                          </a>
                          <p style="padding-top: 10px;">${hit.description}</p>
                      </div>
                  </div>
                  <br>
                `;
              }
            
        },
    })
  ])
]);

search.start();

// Display and hide box on focus/blur
search.on("render", () => {
  const federatedResults = document.querySelector(
    ".federated-results-container"
  );
  const searchBox = document.querySelector(".ais-SearchBox-wrapper");

  searchBox.querySelector("input").addEventListener("focus", () => {
    federatedResults.style.display = "grid";
    searchBox.classList.add("is-open");
  });
  window.addEventListener("click", () => {
    federatedResults.style.display = "none";
  });
  searchBox.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  federatedResults.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
