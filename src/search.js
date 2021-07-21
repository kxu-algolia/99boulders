import instantsearch from "instantsearch.js";
import algoliasearch from "algoliasearch";
import { configure, hits, searchBox, index } from "instantsearch.js/es/widgets";

let appID = "ZCMWU7GCJV";
let apiKey = "fa7849a542f5c67f82291aebac55f07e";

const search = instantsearch({
  //indexName: 'products-bc',
  indexName: "products-bc-distinct",
  searchClient: algoliasearch(appID, apiKey)
});

// Add the widgets
search.addWidgets([
  searchBox({
    container: "#search-box",
    placeholder: "Explore articles, products, gyms...",
    showReset: true,
    showSubmit: true,
    showLoadingIndicator: true
  }),
  index({
    //indexName: 'products-bc',
    indexName: "products-bc-distinct",
    indexId: "products"
  }).addWidgets([
    configure({
      hitsPerPage: 9
    }),
    hits({
      container: "#products",
      templates: {
        empty: "No results",
        item: `
                  <div class="item">
                      <a href={{buy_link}} target="_blank">
                      <figure class="hit-image-container">
                        <div class="hit-image-container-box">
                            <img class="hit-image" src="{{image_url}}" alt="">
                        </div>
                        </figure>
                      <p class="hit-category">&#8203;​</p>
                      <div class="item-content">
                            {{#sale_percentage}}
                                <p class="sale-percentage badge">{{sale_percentage}}% off</p>
                            {{/sale_percentage}}
                          <p class="brand hit-tag">{{{_highlightResult.brand_name.value}}}</p>
                          <p class="name">{{{_highlightResult.product_name.value}}}</p>
                          <p>{{color}}, {{size}}</p>
                          <div class="hit-description" style="margin-top:.5rem;">
                            {{#sale_percentage}}
                                <p class="sale-price" style="font-weight:700;">$ {{sale_price}}</p>
                                </b>
                                <p class="retail-price" style="color:#808080;">
                                    <strike>$ {{retail_price}}</strike>
                                </p>
                                </b>
                            {{/sale_percentage}}
                            {{^sale_percentage}}
                                <p class="retail-price" style="font-weight:700;">$ {{retail_price}}</p>
                                </b>
                            {{/sale_percentage}}
                          </div>
                      </div>
                      </a>
                  </div>
                  <br>`
      }
    })
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
        empty: "No results",
        item: `
                  <div class="item row">
                     <a href={{url}} target="_blank">
                      <figure class="hit-image-container">
                        <div class="hit-image-container-box">
                                {{#sectionImageUrl}}
                                <img class="hit-image" src="{{sectionImageUrl}}" alt="">
                                {{/sectionImageUrl}}
                                {{^sectionImageUrl}}
                                <img class="hit-image" src="{{imageUrl}}" alt="">
                                {{/sectionImageUrl}}
                        </div>
                        </figure>
                      <p class="hit-category">&#8203;​</p>
                      <div class="item-content">
                          <p class="title hit-tag">{{{_highlightResult.title.value}}}</p>
                          <p class="hit-description">{{#helpers.snippet}}{"attribute":"content"}{{/helpers.snippet}}</p>
                      </div>
                    </a>
                  </div>
                  <br>`
      }
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
