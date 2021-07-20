let appID = 'ZCMWU7GCJV';
let apiKey = 'fa7849a542f5c67f82291aebac55f07e';
const searchClient = algoliasearch(appID, apiKey);
const search = instantsearch({
  indexName: 'products-bc-distinct',
  searchClient,
  /*
    searchFunction(helper) {
        console.log("top of searchFunction()");
        console.log(search.helper.getPage());
        helper.search();
    },
    */
});

var initLoad = true;
var brand_name = "Osprey Packs"

search.addWidgets([

    /*
    instantsearch.widgets.breadcrumb({
        container: '#breadcrumb',
        attributes: [
            'categories.lvl0',
            'categories.lvl1',
            'categories.lvl2',
        ],
        separator: '/',
    }),
    */

    instantsearch.widgets.searchBox({
        container: '#searchbox',
    }),
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
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
            `,
        },
    }),
    instantsearch.widgets.refinementList({
        container: '#category-list',
        attribute: 'product_group',
    }),
    instantsearch.widgets.refinementList({
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
    instantsearch.widgets.currentRefinements({
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
    instantsearch.widgets.pagination({
        container: '#pagination',
    }),
    instantsearch.widgets.toggleRefinement({
        container: '#toggle-refinement-sale',
        attribute: 'on_sale',
        templates: {
            labelText: 'On Sale',
        },
    }),

    instantsearch.widgets.numericMenu({
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
    instantsearch.widgets.configure({
        filters: `brand_name: '${brand_name}'`,
        hitsPerPage: 50,
        analyticsTags: ['browse', `${brand_name}`],
    }),



    instantsearch.widgets.queryRuleCustomData({
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
