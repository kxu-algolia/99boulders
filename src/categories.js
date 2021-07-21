/**********************************************************
 * Initialize search clients and UI widgets
 *********************************************************/

import instantsearch from 'instantsearch.js';
import algoliasearch from 'algoliasearch';
import {
    searchBox,
    hits,
    refinementList,
    pagination,
    toggleRefinement,
    numericMenu,
    configure,
    queryRuleCustomData,
} from 'instantsearch.js/es/widgets';

const search = instantsearch({
  indexName: 'products-bc-distinct',
  searchClient: algoliasearch(
    'ZCMWU7GCJV',
    'fa7849a542f5c67f82291aebac55f07e'
    )
});


/**********************************************************
 * Initialize Insights API
 *********************************************************/

import {
  createInsightsMiddleware,
} from 'instantsearch.js/es/middlewares';

const insightsMiddleware = createInsightsMiddleware({
  insightsClient: aa,
});
search.use(insightsMiddleware);
aa('setUserToken', 'admin');


var brand_name = "Osprey Packs"

search.addWidgets([
    searchBox({
        container: '#searchbox',
    }),
    hits({
        container: '#hits',
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

                return `
                    <div class="item">
                        <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                            <img class="item-image" src="${hit.image_url}">
                        </a>
                        ${badge}
                        <a href=${hit.buy_link} ${bindEvent('click', hit, 'Product Click')} target="_blank">
                            <p class="item-product-name">
                                ${instantsearch.highlight({ attribute: 'product_name', hit })}
                            </p>
                        </a>
                        <p>${instantsearch.snippet({attribute: 'long_description', hit, highlightedTagName: 'mark' })} ...</p>
                        ${price}
                    </div>
                    <br>
                `;
            }
        },
    }),
    refinementList({
        container: '#category-list',
        attribute: 'product_group',
    }),
    refinementList({
        container: '#brand-list',
        attribute: 'brand_name',
        searchable: true,
        transformItems(items) {
            return items.map((item) => ({
                ...item,
                isRefined:
                  item.isRefined ||
                  item.value.includes(`${brand_name}`),
              }));
        },
    }),


    /*
    currentRefinements({
        container: '#current-refinements',
        transformItems(items) {
            console.log(items);
            if (initLoad) {
                console.log("top of initLoad");
                initLoad = false;
                items = [
                    {
                        "indexName": "products-bc-distinct",
                        "attribute": "brand_name",
                        "label": "Brand",
                        "refinements": [
                            {
                                "attribute": "brand_name",
                                "type": "disjunctive",
                                "value": "Osprey Packs",
                                "label": "Osprey Packs",
                                "count": 412,
                                "exhaustive": false
                            }
                        ]
                    }
                ];
            }
            return items;
        },
    }),
    */

    pagination({
        container: '#pagination',
    }),
    toggleRefinement({
        container: '#toggle-refinement-sale',
        attribute: 'on_sale',
        templates: {
            labelText: 'On Sale',
        },
    }),
    numericMenu({
        container: '#numeric-sale-percentage',
        attribute: 'sale_percentage',
        items: [
            { label: 'All' },
            { label: '> 50%', start: 50.0, end: 100.0 },
            { label: '25-50%', start: 25.0, end: 50.0 },
            { label: '10-25%', start: 10.0, end: 25.0 },
            { label: '0-10%', start: 0.0, end: 10.0 },
        ],
    }),

    // Set Category Page details here
    configure({
        filters: `brand_name: '${brand_name}'`,
        hitsPerPage: 20,
        analyticsTags: ['browse', `${brand_name}`],
    }),

    queryRuleCustomData({
        container: '#banner',
        templates: {
          default: `
            {{#items}}
              <img class="banner-image" src={{banner}}>                
            {{/items}}
          `,
        },
      }),

]);

search.start();



/*

// Return hits as string 
item: `
    <div class="item">
        <a href={{buy_link}} target="_blank">
            <img class="item-image" src="{{image_url}}">
        </a>

        {{#sale_percentage}}
        <p class="sale-percentage badge">{{sale_percentage}}% off</p>
        {{/sale_percentage}}

        <a href={{buy_link}} target="_blank">
            <p class="item-product-name">{{{_highlightResult.product_name.value}}}</p>
        </a>
        <p>{{#helpers.snippet}}{ "attribute": "long_description", "highlightedTagName": "mark" }{{/helpers.snippet}} ...</p>

        {{#sale_percentage}}
        <div class="item-price-container">
            <p class="item-price">$ {{sale_price}}  </p>
            <p class="item-price-strike"><strike>$ {{retail_price}}</strike></p>
        </div>
        {{/sale_percentage}}

        {{^sale_percentage}}
         <div class="item-price-container">
            <p class="item-price">$ {{retail_price}}  </p>
        </div>

        {{/sale_percentage}}
    </div>
    <br>
`

*/

