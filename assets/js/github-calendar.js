//  Forrest Tindall 2024
// Buy me a Coffee https://venmo.com/u/ForrestTindall

"use strict";
var _typeof2 =
  "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
    ? function (e) {
        return typeof e;
      }
    : function (e) {
        return e &&
          "function" == typeof Symbol &&
          e.constructor === Symbol &&
          e !== Symbol.prototype
          ? "symbol"
          : typeof e;
      };
!(function (e) {
  "object" ===
    ("undefined" == typeof exports ? "undefined" : _typeof2(exports)) &&
  "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : (("undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this
      ).GitHubCalendar = e());
})(function () {
  return (function n(a, o, u) {
    function s(t, e) {
      if (!o[t]) {
        if (!a[t]) {
          var r = "function" == typeof require && require;
          if (!e && r) return r(t, !0);
          if (i) return i(t, !0);
          throw (
            (((e = new Error("Cannot find module '" + t + "'")).code =
              "MODULE_NOT_FOUND"),
            e)
          );
        }
        (r = o[t] = { exports: {} }),
          a[t][0].call(
            r.exports,
            function (e) {
              return s(a[t][1][e] || e);
            },
            r,
            r.exports,
            n,
            a,
            o,
            u
          );
      }
      return o[t].exports;
    }
    for (
      var i = "function" == typeof require && require, e = 0;
      e < u.length;
      e++
    )
      s(u[e]);
    return s;
  })(
    {
      1: [
        function (e, t, r) {
          var b = e("github-calendar-parser"),
            p = e("elly"),
            g = e("add-subtract-date"),
            m = e("formatoid"),
            h = "MMM D, YYYY",
            y = "MMMM D",
            _ = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
          function v(e) {
            return e + " " + (1 === e ? "day" : "days");
          }
          t.exports = function (d, e, f) {
            (d = p(d)),
              ((f = f || {}).summary_text =
                f.summary_text ||
                'Summary of pull requests, issues opened, and commits made by <a href="https://github.com/' +
                  e +
                  '" target="blank">@' +
                  e +
                  "</a>"),
              (f.cache = 1e3 * (f.cache || 86400));
            var r = {
              content: "gh_calendar_content." + e,
              expire_at: "gh_calendar_expire." + e,
            };
            return (
              (f.proxy =
                f.proxy ||
                function (e) {
                  return fetch(
                    "https://api.bloggify.net/gh-calendar/?username=" + e
                  ).then(function (e) {
                    return e.text();
                  });
                }),
              (f.getCalendar =
                f.getCalendar ||
                function (e) {
                  if (
                    f.cache &&
                    Date.now() < +localStorage.getItem(r.expire_at)
                  ) {
                    var t = localStorage.getItem(r.content);
                    if (t) return Promise.resolve(t);
                  }
                  return f.proxy(e).then(function (e) {
                    return (
                      f.cache &&
                        (localStorage.setItem(r.content, e),
                        localStorage.setItem(
                          r.expire_at,
                          Date.now() + f.cache
                        )),
                      e
                    );
                  });
                }),
              (function l() {
                return f
                  .getCalendar(e)
                  .then(function (e) {
                    var t,
                      n,
                      r = document.createElement("div"),
                      e =
                        ((r.innerHTML = e),
                        r.querySelector(".js-yearly-contributions")),
                      a = (p(".position-relative h2", e).remove(), !0),
                      o = !1,
                      u = void 0;
                    try {
                      for (
                        var s, i = r.querySelectorAll("a")[Symbol.iterator]();
                        !(a = (s = i.next()).done);
                        a = !0
                      ) {
                        var c = s.value;
                        c.textContent.includes(
                          "View your contributions in 3D, VR and IRL!"
                        ) && c.parentElement.remove();
                      }
                    } catch (e) {
                      (o = !0), (u = e);
                    } finally {
                      try {
                        !a && i.return && i.return();
                      } finally {
                        if (o) throw u;
                      }
                    }
                    e.querySelector("include-fragment")
                      ? setTimeout(l, 500)
                      : (!0 === f.responsive &&
                          ((o = (r = e.querySelector(
                            "table.js-calendar-graph-table"
                          )).getAttribute("width")),
                          (u = r.getAttribute("height")),
                          r.removeAttribute("height"),
                          r.setAttribute("width", "100%"),
                          r.setAttribute("viewBox", "0 0 " + o + " " + u)),
                        !1 !== f.global_stats &&
                          ((o = (r = b(e.innerHTML)).current_streak
                            ? m(r.current_streak_range[0], y) +
                              " &ndash; " +
                              m(r.current_streak_range[1], y)
                            : r.last_contributed
                            ? "Last contributed in " +
                              m(r.last_contributed, y) +
                              "."
                            : "Noob - Expert"),
                          (u = r.longest_streak
                            ? m(r.longest_streak_range[0], y) +
                              " &ndash; " +
                              m(r.longest_streak_range[1], y)
                            : r.last_contributed
                            ? "Last contributed in " +
                              m(r.last_contributed, y) +
                              "."
                            : "Noob - Expert"),
                          (t = p("<div>", {
                            class:
                              "contrib-column contrib-column-first table-column",
                            html:
                              '<span class="text-muted">Contributions in the last year</span>\n                               <span class="contrib-number">' +
                              r.last_year +
                              ' total</span>\n                               <span class="text-muted">' +
                              m(
                                g.add(
                                  g.subtract(new Date(), 1, "year"),
                                  1,
                                  "day"
                                ),
                                h
                              ) +
                              " &ndash; " +
                              m(new Date(), h) +
                              "</span>",
                          })),
                          (u = p("<div>", {
                            class: "contrib-column table-column",
                            html:
                              '<span class="text-muted">Longest streak</span>\n                               <span class="contrib-number">' +
                              v(r.longest_streak) +
                              '</span>\n                               <span class="text-muted">' +
                              u +
                              "</span>",
                          })),
                          (r = p("<div>", {
                            class: "contrib-column table-column",
                            html:
                              '<span class="text-muted">Current streak</span>\n                               <span class="contrib-number">' +
                              v(r.current_streak) +
                              '</span>\n                               <span class="text-muted">' +
                              o +
                              "</span>",
                          })),
                          e.appendChild(t),
                          e.appendChild(u),
                          e.appendChild(r)),
                        (d.innerHTML = e.innerHTML),
                        !0 === f.tooltips &&
                          ((o = d),
                          (n = document.createElement("div")).classList.add(
                            "day-tooltip"
                          ),
                          o.appendChild(n),
                          o
                            .querySelectorAll(
                              ".js-calendar-graph-svg rect.ContributionCalendar-day"
                            )
                            .forEach(function (e) {
                              e.addEventListener("mouseenter", function (e) {
                                var t = e.target.getAttribute("data-count"),
                                  r =
                                    ("0" === t
                                      ? (t = "No contributions")
                                      : "1" === t
                                      ? (t = "1 contribution")
                                      : (t += " contributions"),
                                    new Date(
                                      e.target.getAttribute("data-date")
                                    )),
                                  r =
                                    _[r.getUTCMonth()] +
                                    " " +
                                    r.getUTCDate() +
                                    ", " +
                                    r.getUTCFullYear(),
                                  t =
                                    ((n.innerHTML =
                                      "<strong>" + t + "</strong> on " + r),
                                    n.classList.add("is-visible"),
                                    e.target.getBoundingClientRect()),
                                  r =
                                    t.left +
                                    window.pageXOffset -
                                    n.offsetWidth / 2 +
                                    t.width / 2,
                                  e =
                                    t.bottom +
                                    window.pageYOffset -
                                    n.offsetHeight -
                                    2 * t.height;
                                (n.style.top = e + "px"),
                                  (n.style.left = r + "px");
                              }),
                                e.addEventListener("mouseleave", function () {
                                  n.classList.remove("is-visible");
                                });
                            })));
                  })
                  .catch(function (e) {
                    return console.error(e);
                  });
              })()
            );
          };
        },
        {
          "add-subtract-date": 2,
          elly: 4,
          formatoid: 6,
          "github-calendar-parser": 8,
        },
      ],
      2: [
        function (e, t, r) {
          function n(a) {
            return function e(t, r, n) {
              switch (((r *= a), n)) {
                case "years":
                case "year":
                  t.setFullYear(t.getFullYear() + r);
                  break;
                case "months":
                case "month":
                  t.setMonth(t.getMonth() + r);
                  break;
                case "weeks":
                case "week":
                  return e(t, 7 * r, "days");
                case "days":
                case "day":
                  t.setDate(t.getDate() + r);
                  break;
                case "hours":
                case "hour":
                  t.setHours(t.getHours() + r);
                  break;
                case "minutes":
                case "minute":
                  t.setMinutes(t.getMinutes() + r);
                  break;
                case "seconds":
                case "second":
                  t.setSeconds(t.getSeconds() + r);
                  break;
                case "milliseconds":
                case "millisecond":
                  t.setMilliseconds(t.getMilliseconds() + r);
                  break;
                default:
                  throw new Error("Invalid range: " + n);
              }
              return t;
            };
          }
          t.exports = { add: n(1), subtract: n(-1) };
        },
        {},
      ],
      3: [
        function (e, t, r) {
          (t.exports.en = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]),
            (t.exports.en.abbr = [
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ]),
            (t.exports.en.short = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]),
            (t.exports.fr = [
              "dimanche",
              "lundi",
              "mardi",
              "mercredi",
              "jeudi",
              "vendredi",
              "samedi",
            ]),
            (t.exports.fr.abbr = [
              "dim",
              "lun",
              "mar",
              "mer",
              "jeu",
              "ven",
              "sam",
            ]),
            (t.exports.fr.short = ["di", "lu", "ma", "me", "je", "ve", "sa"]),
            (t.exports.es = [
              "domingo",
              "lunes",
              "martes",
              "miercoles",
              "jueves",
              "viernes",
              "sabado",
            ]),
            (t.exports.es.abbr = [
              "dom",
              "lun",
              "mar",
              "mir",
              "jue",
              "vie",
              "sab",
            ]),
            (t.exports.es.short = ["do", "lu", "ma", "mi", "ju", "vi", "sa"]),
            (t.exports.it = [
              "Domenica",
              "Lunedi",
              "Martedi",
              "Mercoledi",
              "Giovedi",
              "Venerdi",
              "Sabato",
            ]),
            (t.exports.it.abbr = [
              "Dom",
              "Lun",
              "Mar",
              "Mer",
              "Gio",
              "Ven",
              "Sab",
            ]),
            (t.exports.it.short = ["D", "L", "Ma", "Me", "G", "V", "S"]),
            (t.exports = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ]),
            (t.exports.abbr = [
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ]),
            (t.exports.short = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
        },
        {},
      ],
      4: [
        function (e, t, r) {
          var n = e("iterate-object"),
            a = e("sliced");
          function o(r, e) {
            return "string" == typeof r
              ? "<" === r.charAt(0)
                ? ((r = document.createElement(r.slice(1, -1))),
                  n(e || {}, function (e, t) {
                    switch (t) {
                      case "text":
                        return void (r.textContent = e);
                      case "html":
                        return void (r.innerHTML = e);
                    }
                    r.setAttribute(t, e);
                  }),
                  r)
                : (e = e || document).querySelector(r)
              : r;
          }
          (o.$$ = function (e, t) {
            return "string" == typeof e
              ? ((t = t || document), a(t.querySelectorAll(e)))
              : [e];
          }),
            (t.exports = o);
        },
        { "iterate-object": 9, sliced: 13 },
      ],
      5: [
        function (e, t, r) {
          t.exports = function (e, t, r) {
            r = r || "0";
            t = (t = t || 2) - (e = e.toString()).length;
            return (t <= 0 ? "" : r.repeat(t)) + e;
          };
        },
        {},
      ],
      6: [
        function (e, t, r) {
          var n = e("months"),
            a = e("days"),
            o = e("fillo"),
            e = e("parse-it").Parser,
            u = {
              YYYY: function (e, t) {
                return t ? e.getUTCFullYear() : e.getFullYear();
              },
              YY: function (e, t) {
                return u.YYYY(e, t) % 100;
              },
              MMMM: function (e, t) {
                return t ? n[e.getUTCMonth()] : n[e.getMonth()];
              },
              MMM: function (e, t) {
                return t ? n.abbr[e.getUTCMonth()] : n.abbr[e.getMonth()];
              },
              MM: function (e, t) {
                return o(t ? e.getUTCMonth() + 1 : e.getMonth() + 1);
              },
              M: function (e, t) {
                return t ? e.getUTCMonth() + 1 : e.getMonth() + 1;
              },
              dddd: function (e, t) {
                return a[u.d(e, t)];
              },
              ddd: function (e, t) {
                return a.abbr[u.d(e, t)];
              },
              dd: function (e, t) {
                return a.short[u.d(e, t)];
              },
              d: function (e, t) {
                return t ? e.getUTCDay() : e.getDay();
              },
              DD: function (e, t) {
                return o(u.D(e, t));
              },
              D: function (e, t) {
                return t ? e.getUTCDate() : e.getDate();
              },
              A: function (e, t) {
                return u.a(e, t).toUpperCase();
              },
              a: function (e, t) {
                return 12 <= u.H(e, t) ? "pm" : "am";
              },
              hh: function (e, t) {
                return o(u.h(e, t));
              },
              h: function (e, t) {
                return u.H(e, t) % 12 || 12;
              },
              HH: function (e, t) {
                return o(u.H(e, t));
              },
              H: function (e, t) {
                return t ? e.getUTCHours() : e.getHours();
              },
              mm: function (e, t) {
                return o(u.m(e, t));
              },
              m: function (e, t) {
                return t ? e.getUTCMinutes() : e.getMinutes();
              },
              ss: function (e, t) {
                return o(u.s(e, t));
              },
              s: function (e, t) {
                return t ? e.getUTCSeconds() : e.getSeconds();
              },
              S: function (e, t) {
                return Math.round((u.s(e, t) / 60) * 10);
              },
              SS: function (e, t) {
                return o((u.s(e, t) / 60) * 100);
              },
              SSS: function (e, t) {
                return o((u.s(e, t) / 60) * 1e3, 3);
              },
              Z: function (e) {
                e = -e.getTimezoneOffset();
                return (
                  (0 <= e ? "+" : "-") + o(parseInt(e / 60)) + ":" + o(e % 60)
                );
              },
              ZZ: function (e) {
                e = -e.getTimezoneOffset();
                return (0 <= e ? "+" : "-") + o(parseInt(e / 60)) + o(e % 60);
              },
            },
            s = new e(u);
          t.exports = function (e, t) {
            return s.run(t, [e, e._useUTC]);
          };
        },
        { days: 3, fillo: 5, months: 10, "parse-it": 11 },
      ],
      7: [
        function (e, t, r) {
          t.exports = ["#eee", "#d6e685", "#8cc665", "#44a340", "#1e6823"];
        },
        {},
      ],
      8: [
        function (e, t, r) {
          var u = e("github-calendar-legend");
          t.exports = function (e) {
            function n() {
              if (a.current_streak > a.longest_streak) {
                a.longest_streak = a.current_streak;
                a.longest_streak_range[0] = a.current_streak_range[0];
                a.longest_streak_range[1] = a.current_streak_range[1];
              }
            }
            var a = {
                last_year: 0,
                longest_streak: -1,
                longest_streak_range: [],
                current_streak: 0,
                current_streak_range: [],
                longest_break: -1,
                longest_break_range: [],
                current_break: 0,
                current_break_range: [],
                weeks: [],
                days: [],
                last_contributed: null,
              },
              o = [];
            return (
              e
                .split("\n")
                .slice(2)
                .map(function (e) {
                  return e.trim();
                })
                .forEach(function (e) {
                  if (e.startsWith("<g transform"))
                    return o.length && a.weeks.push(o) && (o = []);
                  var t = e.match(/data-level="([0-9\-]+)"/i),
                    r = e.match(/data-date="([0-9\-]+)"/),
                    e = e.match(/(No|[0-9]+)( contribution)/),
                    t = t && t[1],
                    r = r && r[1],
                    e = e ? ("No" === e[1] && (e[1] = 0), +e[1]) : 0;
                  t &&
                    ((r = {
                      fill: u[t],
                      date: new Date(r),
                      count: e,
                      level: t,
                    }),
                    0 === a.current_streak &&
                      (a.current_streak_range[0] = r.date),
                    0 === a.current_break &&
                      (a.current_break_range[0] = r.date),
                    r.count
                      ? (++a.current_streak,
                        (a.last_year += r.count),
                        (a.last_contributed = r.date),
                        (a.current_streak_range[1] = r.date),
                        a.longest_break < a.current_break &&
                          ((a.longest_break = a.current_break),
                          (a.longest_break_range[0] = a.current_break_range[0]),
                          (a.longest_break_range[1] =
                            a.current_break_range[1])),
                        (a.current_break = 0))
                      : (n(),
                        (a.current_streak = 0),
                        ++a.current_break,
                        (a.current_break_range[1] = r.date)),
                    o.push(r),
                    a.days.push(r));
                }),
              n(),
              a
            );
          };
        },
        { "github-calendar-legend": 7 },
      ],
      9: [
        function (e, t, r) {
          var a =
            "function" == typeof Symbol &&
            "symbol" === _typeof2(Symbol.iterator)
              ? function (e) {
                  return void 0 === e ? "undefined" : _typeof2(e);
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : void 0 === e
                    ? "undefined"
                    : _typeof2(e);
                };
          t.exports = function (e, t) {
            var r,
              n = 0;
            if (Array.isArray(e))
              for (; n < e.length && !1 !== t(e[n], n, e); ++n);
            else if (
              "object" === (void 0 === e ? "undefined" : a(e)) &&
              null !== e
            )
              for (
                r = Object.keys(e);
                n < r.length && !1 !== t(e[r[n]], r[n], e);
                ++n
              );
          };
        },
        {},
      ],
      10: [
        function (e, t, r) {
          (t.exports = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]),
            (t.exports.abbr = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]),
            (t.exports.it = [
              "Gennaio",
              "Febbraio",
              "Marzo",
              "Aprile",
              "Maggio",
              "Giugno",
              "Luglio",
              "Agosto",
              "Settembre",
              "Ottobre",
              "Novembre",
              "Dicembre",
            ]),
            (t.exports.abbr.it = [
              "Gen",
              "Feb",
              "Mar",
              "Apr",
              "Mag",
              "Giu",
              "Lug",
              "Ago",
              "Set",
              "Ott",
              "Nov",
              "Dic",
            ]),
            (t.exports.de = [
              "Januar",
              "Februar",
              "März",
              "April",
              "Mai",
              "Juni",
              "Juli",
              "August",
              "September",
              "Oktober",
              "November",
              "Dezember",
            ]),
            (t.exports.abbr.de = [
              "Jan",
              "Feb",
              "Mär",
              "Apr",
              "Mai",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dez",
            ]);
        },
        {},
      ],
      11: [
        function (e, t, r) {
          var n = function (e, t, r) {
            return t && a(e.prototype, t), r && a(e, r), e;
          };
          function a(e, t) {
            for (var r = 0; r < t.length; r++) {
              var n = t[r];
              (n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                "value" in n && (n.writable = !0),
                Object.defineProperty(e, n.key, n);
            }
          }
          var o = e("regex-escape"),
            u =
              (n(s, [
                {
                  key: "run",
                  value: function (e, t) {
                    var r = "";
                    t = t || [];
                    do {
                      var n = e.match(this.re),
                        n = n && n[1],
                        a = n || e.charAt(0);
                    } while (
                      ((r += n
                        ? (n =
                            "function" == typeof (n = this.obj[n])
                              ? n.apply(this, t)
                              : n)
                        : a),
                      (e = e.substring(a.length)))
                    );
                    return r;
                  },
                },
              ]),
              s);
          function s(e) {
            if (!(this instanceof s))
              throw new TypeError("Cannot call a class as a function");
            (this.obj = e || {}),
              (this.re = new RegExp(
                "^(" + Object.keys(e).map(o).join("|") + ")"
              ));
          }
          function i(e, t, r) {
            return new u(t).run(e, r);
          }
          (i.Parser = u), (t.exports = i);
        },
        { "regex-escape": 12 },
      ],
      12: [
        function (e, t, r) {
          function n(e) {
            return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
          }
          (n.proto = function () {
            return (RegExp.escape = n);
          }),
            (t.exports = n);
        },
        {},
      ],
      13: [
        function (e, t, r) {
          t.exports = function (e, t, r) {
            var n = [],
              a = e.length;
            if (0 !== a) {
              var o = t < 0 ? Math.max(0, t + a) : t || 0;
              for (void 0 !== r && (a = r < 0 ? r + a : r); a-- > o; )
                n[a - o] = e[a];
            }
            return n;
          };
        },
        {},
      ],
    },
    {},
    [1]
  )(1);
});
