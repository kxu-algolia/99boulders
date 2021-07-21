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
 * Carousels
 *********************************************************/

const renderCarouselProduct = ({ widgetParams, hits, bindEvent }, isFirstRender) => {
    const container = document.querySelector(widgetParams.container);

    if (isFirstRender) {
        const carouselUl = document.createElement('ul');
        carouselUl.classList.add('carousel-list-container');
        container.appendChild(carouselUl);
    }

    container.querySelector('ul').innerHTML = hits.map(function(hit) {

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
            <li class="item">
                <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                    <img class="item-image" src="${hit.image_url}">
                </a>
                ${badge}
                <p>${hit.brand_name}</p>
                <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                    <p class="item-product-name">${product_name}</p>
                </a>
                ${price}
            </li>
        `;

    }, bindEvent).join('');
};

const renderCarouselArticle = ({ widgetParams, hits, bindEvent }, isFirstRender) => {
    const container = document.querySelector(widgetParams.container);

    if (isFirstRender) {
        const carouselUl = document.createElement('ul');
        carouselUl.classList.add('carousel-list-container');
        container.appendChild(carouselUl);
    }

    container.querySelector('ul').innerHTML = hits.map(function(hit) {
        return `
            <li class="item">
                <a href=${hit.url} ${bindEvent('click', hit, 'Article Click')} target="_blank">
                    <img class="item-image-article" src="${hit.imageUrl}">
                </a>
                <a href=${hit.url} ${bindEvent('click', hit, 'Article Click')} target="_blank">
                    <p class="item-article-name">${hit.title}</p>
                </a>
                <p>${hit.description}</p>
            </li>
        `;
    }, bindEvent).join('');
};

const renderCarouselProductHits = connectHits(renderCarouselProduct);
const renderCarouselArticleHits = connectHits(renderCarouselArticle);

search.addWidgets([

    //
    // Product Carousels
    //
    index({
        indexName: 'products-bc-distinct_sale_percentage_desc',
        indexId: 'carousel-product-best-deals',
    }).addWidgets([
        configure({
            hitsPerPage: 10,
        }),
        renderCarouselProductHits({
            container: '#carousel-products-best-deals',
        }),
    ]),
    index({
        indexName: 'products-bc-distinct',
        indexId: 'carousel-products-osprey-collection',
    }).addWidgets([
        configure({
            hitsPerPage: 8,
            ruleContexts: ['carousel_osprey_collection'],
        }),
        renderCarouselProductHits({
            container: '#carousel-products-osprey-collection',
        }),
    ]),

    //
    // Article Carousels
    //
    index({
        indexName: 'crawler_99boulders',
        indexId: 'carousel-articles-best-of',
    }).addWidgets([
        configure({
            hitsPerPage: 3,
            ruleContexts: ['carousel_articles_best_of'],
        }),
        renderCarouselArticleHits({
            container: '#carousel-articles-best-of',
        }),
    ]),

]);

search.start();



/**********************************************************
 * Federated Search Box
 *********************************************************/


/*

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
        //indexName: 'products-bc',
        indexName: 'products-bc-distinct',
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
                  <br>`,
            },
        }),
    ]),
    index({
        indexName: 'crawler_99boulders',
        indexId: 'blog',
    }).addWidgets([
        configure({
            hitsPerPage: 9,
        }),
        hits({
            container: '#blog',
            templates: {
                empty: 'No results',
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

*/
