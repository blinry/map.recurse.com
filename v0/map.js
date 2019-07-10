// Some Levenshtein-distnace code
// http://www.merriampark.com/ld.htm, http://www.mgilleland.com/ld/ldjavascript.htm, Damerau–Levenshtein distance (Wikipedia)
var levDist = function(s, t) {
    var d = [] //2d matrix

    // Step 1
    var n = s.length
    var m = t.length

    if (n == 0) return m
    if (m == 0) return n

    // Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = []

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i
    for (var j = m; j >= 0; j--) d[0][j] = j

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1)

        // Step 4
        for (var j = 1; j <= m; j++) {
            // Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n

            var t_j = t.charAt(j - 1)
            var cost = s_i == t_j ? 0 : 1 // Step 5

            // Calculate the minimum
            var mi = d[i - 1][j] + 1
            var b = d[i][j - 1] + 1
            var c = d[i - 1][j - 1] + cost

            if (b < mi) mi = b
            if (c < mi) mi = c

            d[i][j] = mi // Step 6

            // Damerau transposition
            if (
                i > 1 &&
                j > 1 &&
                s_i == t.charAt(j - 2) &&
                s.charAt(i - 2) == t_j
            ) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost)
            }
        }
    }

    // Step 7
    return d[n][m]
}

var things = {}

$(function() {
    var marker
    var Icon = L.icon({
        iconUrl: "leaflet/images/marker-icon-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowUrl: "leaflet/images/marker-shadow.png",
    })

    var res = $("#result")
    var search = $("#searchtext")
    function performSearch() {
        var searchstring = search.val().toLowerCase()
        var searchresult = Object.keys(things).sort(function(a, b) {
            return (
                levDist(searchstring, a.toLowerCase()) -
                levDist(searchstring, b.toLowerCase())
            )
        })
        var html = ""
        for (var i = 0; i < Math.min(searchresult.length, 10); i++) {
            html += "<li>" + searchresult[i] + "</li>"
        }

        if (html != "") res.show()
        else res.hide()
        if (things[search]) {
            addMarker(things[search])
            $("#btnmarker").addClass("active")
            setHash()
        }
        $("#result ul").html(html)
        $("#result ul li:first").addClass("selected")
        $("#result ul li").click(function() {
            select($(this).text())
        })
        res.css({
            top: search.position().top + search.height() + 10,
            left: search.position().left,
        })
    }

    function select(text) {
        addMarker(things[text])
        $("#btnmarker").addClass("active")
        setHash()
        res.hide()
    }

    $("#searchtext").keypress(function(e) {
        switch (e.keyCode) {
            case 13: // Enter
                var selected = $("#result ul li.selected").first()
                if (selected) selected.click()
                break
            default:
                setTimeout(performSearch, 10)
        }
    })

    var map = L.map("map", {
        minZoom: 0,
        maxZoom: 4,
        zoom: 2,
        center: [0, 0],
    })

    L.tileLayer("https://blinry.github.io/map-of-rc-tiles/{z}/{x}/{y}.jpg", {
        attribution:
            'Improve the code on <a href="https://github.com/blinry/map.recurse.com">GitHub</a>!',
        noWrap: true,
        detectRetina: true,
    }).addTo(map)

    $("#btnmarker").on("click", function(event) {
        setTimeout(function() {
            var button = $(event.currentTarget)
            if (button.hasClass("active")) {
                addMarker()
            } else {
                removeMarker()
            }
        }, 0)
    })

    setTimeout(getHash, 0)

    function getHash() {
        var hash = window.location.hash
        if (hash) {
            hash = hash.match(/([\-0-9]*)_([\-0-9]*)/)
            if (hash) {
                var pos = [
                    parseInt(hash[1], 10) / 1000,
                    parseInt(hash[2], 10) / 1000,
                ]
                addMarker(pos)
                $("#btnmarker").addClass("active")
            }
        }
    }

    function addMarker(pos) {
        removeMarker()
        if (pos) {
            map.setView(pos, 2)
            marker = L.marker(pos, {
                icon: Icon,
            })
            marker.addTo(map)
        } else {
            marker = L.marker(map.getCenter(), {
                draggable: true,
                opacity: 0.7,
                icon: Icon,
            })
            marker.on("dragend", setHash)
            setHash()
            marker.addTo(map)
        }
    }

    function removeMarker() {
        if (marker) {
            map.removeLayer(marker)
            marker = false
            setHash()
        }
    }

    function setHash() {
        if (marker) {
            var pos = marker.getLatLng()
            pos = [
                (1000 * pos.lat).toFixed(0),
                (1000 * pos.lng).toFixed(0),
            ].join("_")
            window.location.hash = pos
        } else {
            window.location.hash = ""
        }
    }
})
