import Result from "./results/result";
import TextSearch from "./text-search";
import ListFacet from "./list-facet";
import ResultHeader from "./results/header";
import ResultList from "./results/list";
import ResultPending from "./results/pending";
import ResultContainer from "./results/container";
import ResultPagination from "./results/pagination";
import PreloadIndicator from "./results/preload-indicator";
import SearchFieldContainer from "./search-field-container";
import RangeFacet from "./range-facet";
import CountLabel from "./results/count-label";
import SortMenu from "./sort-menu";


export default {
	searchFields: {
		text: TextSearch,
		"list-facet": ListFacet,
		"range-facet": RangeFacet,
		container: SearchFieldContainer
	},
	results: {
		result: Result,
		resultCount: CountLabel,
		header: ResultHeader,
		list: ResultList,
		container: ResultContainer,
		pending: ResultPending,
		preloadIndicator: PreloadIndicator,
		paginate: ResultPagination
	},
	sortFields: {
		menu: SortMenu
	}
};