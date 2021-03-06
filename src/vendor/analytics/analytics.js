/**
 * Angular Google Analytics - Easy tracking for your AngularJS application
 * @version v0.0.17 - 2015-07-09
 * @link http://github.com/revolunet/angular-google-analytics
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";
angular.module("angular-google-analytics", []).provider("Analytics", function() {
    var n, e, t, a, i, c, r = !1, o = !0, s = "", u = !1, l = "$routeChangeSuccess", g = "auto", d = !1, m = !1, _ = !1, f = !1, h = !1, p = {allowLinker: !0}, k = !1, v = !1;
    this._logs = [], this.setAccount = function(e) {
        return n = e, !0
    }, this.trackPages = function(n) {
        return o = n, !0
    }, this.trackPrefix = function(n) {
        return s = n, !0
    }, this.setDomainName = function(n) {
        return t = n, !0
    }, this.useDisplayFeatures = function(n) {
        return e = !!n, !0
    }, this.useAnalytics = function(n) {
        return u = !!n, !0
    }, this.useEnhancedLinkAttribution = function(n) {
        return _ = !!n, !0
    }, this.useCrossDomainLinker = function(n) {
        return h = !!n, !0
    }, this.setCrossLinkDomains = function(n) {
        return c = n, !0
    }, this.setPageEvent = function(n) {
        return l = n, !0
    }, this.setCookieConfig = function(n) {
        return g = n, !0
    }, this.useECommerce = function(n, e) {
        return d = !!n, m = !!e, !0
    }, this.setRemoveRegExp = function(n) {
        return n instanceof RegExp ? (a = n, !0) : !1
    }, this.setExperimentId = function(n) {
        return i = n, !0
    }, this.ignoreFirstPageLoad = function(n) {
        return f = !!n, !0
    }, this.trackUrlParams = function(n) {
        return k = !!n, !0
    }, this.delayScriptTag = function(n) {
        return v = !!n, !0
    }, this.$get = ["$document", "$location", "$log", "$rootScope", "$window", function(E, y, w, A, T) {
            function P(n) {
                !u && T._gaq && "function" == typeof n && n()
            }
            function b(n) {
                u && T.ga && "function" == typeof n && n()
            }
            function C(n, e) {
                return!angular.isUndefined(e) && "name"in e && e.name ? e.name + "." + n : n
            }
            function q(n, e) {
                return n in e && e[n]
            }
            var I = this, j = function() {
                var n = k ? y.url() : y.path();
                return a ? n.replace(a, "") : n
            }, L = function() {
                var n = {utm_source: "campaignSource", utm_medium: "campaignMedium", utm_term: "campaignTerm", utm_content: "campaignContent", utm_campaign: "campaignName"}, e = {};
                return angular.forEach(y.search(), function(t, a) {
                    var i = n[a];
                    angular.isDefined(i) && (e[i] = t)
                }), e
            };
            return this._log = function() {
                arguments.length > 0 && (arguments.length > 1 && "warn" === arguments[0] && w.warn(Array.prototype.slice.call(arguments, 1)), this._logs.push(arguments))
            }, this._createScriptTag = function() {
                if (!n)
                    return I._log("warn", "No account id set to create script tag"), void 0;
                if (r)
                    return I._log("warn", "Script tag already created"), void 0;
                T._gaq = [], T._gaq.push(["_setAccount", n]), t && T._gaq.push(["_setDomainName", t]), _ && T._gaq.push(["_require", "inpage_linkid", "//www.google-analytics.com/plugins/ga/inpage_linkid.js"]), o && !f && (a ? T._gaq.push(["_trackPageview", j()]) : T._gaq.push(["_trackPageview"]));
                var i;
                return i = e ? ("https:" === document.location.protocol ? "https://" : "http://") + "stats.g.doubleclick.net/dc.js" : ("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js", function() {
                    var n = E[0], e = n.createElement("script");
                    e.type = "text/javascript", e.async = !0, e.src = i;
                    var t = n.getElementsByTagName("script")[0];
                    t.parentNode.insertBefore(e, t)
                }(i), r = !0
            }, this._createAnalyticsScriptTag = function() {
                if (!n)
                    return I._log("warn", "No account id set to create analytics script tag"), void 0;
                if (r)
                    return I._log("warn", "Analytics script tag already created"), void 0;
                if (function(n, e, t, a, i, c, r) {
                    n.GoogleAnalyticsObject = i, n[i] = n[i] || function() {
                        (n[i].q = n[i].q || []).push(arguments)
                    }, n[i].l = 1 * new Date, c = e.createElement(t), r = e.getElementsByTagName(t)[0], c.async = 1, c.src = a, r.parentNode.insertBefore(c, r)
                }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"), angular.isArray(n) ? n.forEach(function(n) {
                    var e, t = "cookieConfig"in n ? n.cookieConfig : g;
                    q("crossDomainLinker", n) && (n.allowLinker = n.crossDomainLinker), angular.forEach(["name", "allowLinker"], function(t) {
                        t in n && (angular.isUndefined(e) && (e = {}), e[t] = n[t])
                    }), angular.isUndefined(e) ? T.ga("create", n.tracker, t) : T.ga("create", n.tracker, t, e), e && "allowLinker"in e && e.allowLinker && (T.ga(C("require", n), "linker"), q("crossLinkDomains", n) && T.ga(C("linker:autoLink", n), n.crossLinkDomains))
                }) : h ? (T.ga("create", n, g, p), T.ga("require", "linker"), c && T.ga("linker:autoLink", c)) : T.ga("create", n, g), e && T.ga("require", "displayfeatures"), o && !f && T.ga("send", "pageview", j()), T.ga && (d && (m ? T.ga("require", "ec", "ec.js") : T.ga("require", "ecommerce", "ecommerce.js")), _ && T.ga("require", "linkid", "linkid.js"), i)) {
                    var t = document.createElement("script"), a = document.getElementsByTagName("script")[0];
                    t.src = "//www.google-analytics.com/cx/api.js?experiment=" + i, a.parentNode.insertBefore(t, a)
                }
                return r = !0
            }, this._ecommerceEnabled = function() {
                return d ? m ? (this._log("warn", "Enhanced ecommerce plugin is enabled. Only one plugin(ecommerce/ec) can be used at a time. Use AnalyticsProvider.setECommerce(true, false);"), !1) : !0 : (this._log("warn", "ecommerce not set. Use AnalyticsProvider.setECommerce(true, false);"), !1)
            }, this._enhancedEcommerceEnabled = function() {
                return d ? m ? !0 : (this._log("warn", "Enhanced ecommerce plugin is disabled. Use AnalyticsProvider.setECommerce(true, true);"), !1) : (this._log("warn", "ecommerce not set. Use AnalyticsProvider.setECommerce(true, true);"), !1)
            }, this._trackPage = function(e, t, a) {
                var i = this, c = arguments;
                e = e ? e : j(), t = t ? t : E[0].title, P(function() {
                    T._gaq.push(["_set", "title", t]), T._gaq.push(["_trackPageview", s + e]), i._log("_trackPageview", e, t, c)
                }), b(function() {
                    var r = {page: s + e, title: t};
                    angular.extend(r, L()), angular.isObject(a) && angular.extend(r, a), angular.isArray(n) ? n.forEach(function(n) {
                        T.ga(C("send", n), "pageview", r)
                    }) : T.ga("send", "pageview", r), i._log("pageview", e, t, c)
                })
            }, this._trackEvent = function(e, t, a, i, c, r) {
                var o = this, s = arguments;
                P(function() {
                    T._gaq.push(["_trackEvent", e, t, a, i, !!c]), o._log("trackEvent", s)
                }), b(function() {
                    var u = {};
                    angular.isDefined(c) && (u.nonInteraction = !!c), angular.isObject(r) && angular.extend(u, r), angular.isArray(n) ? n.forEach(function(n) {
                        q("trackEvent", n) && T.ga(C("send", n), "event", e, t, a, i, u)
                    }) : T.ga("send", "event", e, t, a, i, u), o._log("event", s)
                })
            }, this._addTrans = function(n, e, t, a, i, c, r, o, s) {
                var u = this, l = arguments;
                P(function() {
                    T._gaq.push(["_addTrans", n, e, t, a, i, c, r, o]), u._log("_addTrans", l)
                }), b(function() {
                    u._ecommerceEnabled() && (T.ga("ecommerce:addTransaction", {id: n, affiliation: e, revenue: t, tax: a, shipping: i, currency: s || "USD"}), u._log("ecommerce:addTransaction", l))
                })
            }, this._addItem = function(n, e, t, a, i, c) {
                var r = this, o = arguments;
                P(function() {
                    T._gaq.push(["_addItem", n, e, t, a, i, c]), r._log("_addItem", o)
                }), b(function() {
                    r._ecommerceEnabled() && (T.ga("ecommerce:addItem", {id: n, name: t, sku: e, category: a, price: i, quantity: c}), r._log("ecommerce:addItem", o))
                })
            }, this._trackTrans = function() {
                var n = this, e = arguments;
                P(function() {
                    T._gaq.push(["_trackTrans"]), n._log("_trackTrans", e)
                }), b(function() {
                    n._ecommerceEnabled() && (T.ga("ecommerce:send"), n._log("ecommerce:send", e))
                })
            }, this._clearTrans = function() {
                var n = this, e = arguments;
                b(function() {
                    n._ecommerceEnabled() && (T.ga("ecommerce:clear"), n._log("ecommerce:clear", e))
                })
            }, this._addProduct = function(n, e, t, a, i, c, r, o, s) {
                var u = this, l = arguments;
                P(function() {
                    T._gaq.push(["_addProduct", n, e, t, a, i, c, r, o, s]), u._log("_addProduct", l)
                }), b(function() {
                    u._enhancedEcommerceEnabled() && (T.ga("ec:addProduct", {id: n, name: e, category: t, brand: a, variant: i, price: c, quantity: r, coupon: o, position: s}), u._log("ec:addProduct", l))
                })
            }, this._addImpression = function(n, e, t, a, i, c, r, o) {
                var s = this, u = arguments;
                P(function() {
                    T._gaq.push(["_addImpression", n, e, t, a, i, c, r, o]), s._log("_addImpression", u)
                }), b(function() {
                    s._enhancedEcommerceEnabled() && T.ga("ec:addImpression", {id: n, name: e, category: i, brand: a, variant: c, list: t, position: r, price: o}), s._log("ec:addImpression", u)
                })
            }, this._addPromo = function(n, e, t, a) {
                var i = this, c = arguments;
                P(function() {
                    T._gaq.push(["_addPromo", n, e, t, a]), i._log("_addPromo", arguments)
                }), b(function() {
                    i._enhancedEcommerceEnabled() && (T.ga("ec:addPromo", {id: n, name: e, creative: t, position: a}), i._log("ec:addPromo", c))
                })
            }, this._getActionFieldObject = function(n, e, t, a, i, c, r, o, s) {
                var u = {};
                return n && (u.id = n), e && (u.affiliation = e), t && (u.revenue = t), a && (u.tax = a), i && (u.shipping = i), c && (u.coupon = c), r && (u.list = r), o && (u.step = o), s && (u.option = s), u
            }, this._setAction = function(n, e) {
                var t = this, a = arguments;
                P(function() {
                    T._gaq.push(["_setAction", n, e]), t._log("__setAction", a)
                }), b(function() {
                    t._enhancedEcommerceEnabled() && (T.ga("ec:setAction", n, e), t._log("ec:setAction", a))
                })
            }, this._trackTransaction = function(n, e, t, a, i, c, r, o, s) {
                this._setAction("purchase", this._getActionFieldObject(n, e, t, a, i, c, r, o, s))
            }, this._trackRefund = function(n) {
                this._setAction("refund", this._getActionFieldObject(n))
            }, this._trackCheckOut = function(n, e) {
                this._setAction("checkout", this._getActionFieldObject(null, null, null, null, null, null, null, n, e))
            }, this._trackCart = function(n) {
                -1 !== ["add", "remove"].indexOf(n) && (this._setAction(n), this._send("event", "UX", "click", n + " to cart"))
            }, this._promoClick = function(n) {
                this._setAction("promo_click"), this._send("event", "Internal Promotions", "click", n)
            }, this._productClick = function(n) {
                this._setAction("click", this._getActionFieldObject(null, null, null, null, null, null, n, null, null)), this._send("event", "UX", "click", n)
            }, this._send = function() {
                var n = this, e = Array.prototype.slice.call(arguments);
                e.unshift("send"), b(function() {
                    T.ga.apply(this, e), n._log(e)
                })
            }, this._pageView = function() {
                this._send("pageview")
            }, this._set = function(n, e) {
                var t = this;
                b(function() {
                    T.ga("set", n, e), t._log("set", n, e)
                })
            }, v || (u ? this._createAnalyticsScriptTag() : this._createScriptTag()), o && A.$on(l, function() {
                I._trackPage()
            }), this._trackTimings = function(n, e, t, a) {
                this._send("timing", n, e, t, a)
            }, {_logs: I._logs, displayFeatures: e, ecommerce: d, enhancedEcommerce: m, enhancedLinkAttribution: _, getUrl: j, experimentId: i, ignoreFirstPageLoad: f, delayScriptTag: v, setCookieConfig: I._setCookieConfig, getCookieConfig: function() {
                    return g
                }, createAnalyticsScriptTag: function(n) {
                    return n && (g = n), I._createAnalyticsScriptTag()
                }, createScriptTag: function(n) {
                    return n && (g = n), I._createScriptTag()
                }, ecommerceEnabled: function() {
                    return I._ecommerceEnabled()
                }, enhancedEcommerceEnabled: function() {
                    return I._enhancedEcommerceEnabled()
                }, trackPage: function(n, e, t) {
                    I._trackPage(n, e, t)
                }, trackEvent: function(n, e, t, a, i, c) {
                    I._trackEvent(n, e, t, a, i, c)
                }, addTrans: function(n, e, t, a, i, c, r, o, s) {
                    I._addTrans(n, e, t, a, i, c, r, o, s)
                }, addItem: function(n, e, t, a, i, c) {
                    I._addItem(n, e, t, a, i, c)
                }, trackTrans: function() {
                    I._trackTrans()
                }, clearTrans: function() {
                    I._clearTrans()
                }, addProduct: function(n, e, t, a, i, c, r, o, s) {
                    I._addProduct(n, e, t, a, i, c, r, o, s)
                }, addPromo: function(n, e, t, a) {
                    I._addPromo(n, e, t, a)
                }, addImpression: function(n, e, t, a, i, c, r, o) {
                    I._addImpression(n, e, t, a, i, c, r, o)
                }, productClick: function(n) {
                    I._productClick(n)
                }, promoClick: function(n) {
                    I._promoClick(n)
                }, trackDetail: function() {
                    I._setAction("detail"), I._pageView()
                }, trackCart: function(n) {
                    I._trackCart(n)
                }, trackCheckout: function(n, e) {
                    I._trackCheckOut(n, e)
                }, trackTimings: function(n, e, t, a) {
                    I._trackTimings(n, e, t, a)
                }, trackTransaction: function(n, e, t, a, i, c, r, o, s) {
                    I._trackTransaction(n, e, t, a, i, c, r, o, s)
                }, setAction: function(n, e) {
                    I._setAction(n, e)
                }, send: function(n) {
                    I._send(n)
                }, pageView: function() {
                    I._pageView()
                }, set: function(n, e) {
                    I._set(n, e)
                }}
        }]
}).directive("gaTrackEvent", ["Analytics", "$parse", function(n, e) {
        return{restrict: "A", link: function(t, a, i) {
                var c = e(i.gaTrackEvent);
                a.bind("click", function() {
                    (!i.gaTrackEventIf || t.$eval(i.gaTrackEventIf)) && c.length > 1 && n.trackEvent.apply(n, c(t))
                })
            }}
    }]);