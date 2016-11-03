declare module "solr-faceted-search-react" {
    interface SearchField {
        field: string,
        type: string,
        lowerBound?: string,
        upperBound?: string,
        label?: string,
        value?: string | Array<string | number>
    }

    interface SearchFilter {
        field: string,
        value: string | Array<string | number>,
        label?: string,
    }

    interface SortField {
        field: string,
        label?: string,
        value?: string
        facetSort?: "count" | "index",
    }

    interface QueryState {
        url: string
        searchFields: Array<SearchField>,
        sortFields: Array<SortField>,
        cursorMark?: string,
        filters?: Array<SearchFilter>,
        idField?: string
        pageStrategy?: "paginate" | "cursor",
        rows?: number,
        start?: number,
        facetLimit?: number,
        facetSort?: "count" | "index",
    }

    interface FacetState {
        [key: string]: Array<number | string>
    }

    interface ResultState {
        pending: boolean,
        numFound: number,
        facets: FacetState,
        docs: Array<Object>
    }

    export interface SearchState {
        query: QueryState,
        results: ResultState
    }

    export interface SearchHandlers {
        onFacetSortChange: Function,
        onNextCursorQuery: Function,
        onPageChange: Function,
        onSearchFieldChange: Function,
        onSortFieldChange: Function
    }

    interface OnChange {
        (state: SearchState, handlers?: SearchHandlers): void;
    }

    interface SolrClientSettings {
        url: string,
        searchFields: Array<SearchField>,
        sortFields: Array<SortField>,
        onChange: OnChange,
        rows?: number,
        pageStrategy?: "paginate" | "cursor",
        idField?: string,
        facetLimit?: number,
        facetSort?: "index" | "count",
        filters?: Array<SearchFilter>
    }


    export class SolrClient {
        constructor(settings: SolrClientSettings)
        setFilters(filters: Array<SearchFilter>): void
        setSortFieldValue(field: string, value: "asc" | "desc"): void
        setFacetSort(field: string, value: "count" | "index"): void
        setSearchFieldValue(field: string, value: string | Array<string | number>): void
        setCurrentPage(page: number): void
        sendQuery(query: QueryState): void
        initialize(): void
        state: SearchState
    }

    interface SearchFieldComponents {
        text: Object,
        "list-facet": Object,
        "range-facet": Object,
        container: Object,
        currentQuery: Object
    }

    interface ResultComponents {
        result: Object,
        resultCount: Object,
        header: Object,
        list: Object,
        container: Object,
        pending: Object,
        preloadIndicator: Object,
        paginate: Object
    }

    interface SortFieldComponents {
        menu: Object
    }

    interface DefaultComponentPack {
        searchFields: SearchFieldComponents,
        results: ResultComponents,
        sortFields: SortFieldComponents
    }

    interface SolrFacetedSearchProps extends SearchHandlers {
        bootstrapCss?: boolean,
        customComponents?: DefaultComponentPack,
        onSelectDoc: (doc: Object) => void,
        query: QueryState,
        results: ResultState,
        truncateFacetListsAt?: number
    }

    //noinspection TypeScriptValidateTypes
    export class SolrFacetedSearch extends React.Component<SolrFacetedSearchProps,{}> {
    }

    export var defaultComponentPack: DefaultComponentPack
}

