interface SearchField {
    field: string,
    type: string,
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

interface SearchState {
    query: QueryState,
    results: ResultState
}

interface SearchHandlers {
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

interface SolrFacetedSearchProps extends SearchHandlers {
    bootstrapCss?: boolean,
    customComponents?: Object,
    onSelectDoc: (doc: Object) => void,
    query: QueryState,
    results: ResultState,
    truncateFacetListsAt?: number
}

declare module "solr-faceted-search-react" {
    export class SolrClient {
        constructor(settings: SolrClientSettings)
        initialize(): void
    }

    export class SolrFacetedSearch extends React.Component<SolrFacetedSearchProps,{}> {
    }
}

