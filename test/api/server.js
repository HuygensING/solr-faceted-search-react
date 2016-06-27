import expect from "expect";
import sinon from "sinon";
import server from "../../src/api/server";

describe("server", () => { //eslint-disable-line no-undef

	describe("submitQuery", () => { //eslint-disable-line no-undef

		it("should invoke the callback with SET_RESULTS_PENDING action type before submitting the query", (done) => { //eslint-disable-line no-undef

			server.submitQuery({searchFields: [], sortFields: []}, (payload) => {
				let exception = null;
				try {
					expect(payload).toEqual({ type: "SET_RESULTS_PENDING" });
				} catch (e) {
					exception = e;
				}
				sinon.stub(server, "performXhr", () => {
					server.performXhr.restore();
					done(exception);
				});
			});
		});

		it("should perform an xhr POST request with the result of the solrQuery builder", (done) => { //eslint-disable-line no-undef

			sinon.stub(server, "performXhr", (opts) => {
				server.performXhr.restore();
				try {
					const { url, data, method, headers } = opts;
					expect(url).toEqual("/url");
					expect(data.indexOf("q=*:*") > -1).toEqual(true);
					expect(method).toEqual("POST");
					expect(headers).toEqual({
						"Content-type": "application/x-www-form-urlencoded"
					});
					done();
				} catch (e) {
					done(e);
				}
			});

			server.submitQuery({
				url: "/url",
				searchFields: [],
				sortFields: [],
				rows: 20,
				start: 0
			}, () => { });
		});

		it("should invoke the callback with SET_RESULTS with the response body as data", (done) => { //eslint-disable-line no-undef

			server.submitQuery({
				url: "/url",
				searchFields: [],
				sortFields: [],
				rows: 20,
				start: 0
			}, (payload) => {
				if (payload.type === "SET_RESULTS_PENDING") {
					sinon.stub(server, "performXhr", (opts, cb) => {
						server.performXhr.restore();
						cb(null, {
							statusCode: 200,
							body: "{\"data\": true}"
						});
					});
				} else {
					try {
						expect(payload.type).toEqual("SET_RESULTS");
						expect(payload.data).toEqual({data: true});
						done();
					} catch (e) {
						done(e);
					}
				}
			});

		});
	});

});