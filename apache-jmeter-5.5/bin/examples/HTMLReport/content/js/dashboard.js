/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.83, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "JDBC Hitter"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.5, 500, 1500, "Get Loco Weather"], "isController": false}, {"data": [1.0, 500, 1500, "Samurai 15"], "isController": false}, {"data": [1.0, 500, 1500, "Put Request"], "isController": false}, {"data": [0.0, 500, 1500, "Get FTP Request"], "isController": false}, {"data": [0.7, 500, 1500, "Assertion R Test"], "isController": false}, {"data": [1.0, 500, 1500, "Request 8"], "isController": false}, {"data": [0.5, 500, 1500, "Soap WSDL Request"], "isController": false}, {"data": [1.0, 500, 1500, "Request Ivanovich Baklanov"], "isController": false}, {"data": [1.0, 500, 1500, "Request Ahmed Sheriff"], "isController": false}, {"data": [1.0, 500, 1500, "Request 1"], "isController": false}, {"data": [0.0, 500, 1500, "Post FTP Request"], "isController": false}, {"data": [1.0, 500, 1500, "Request 15"], "isController": false}, {"data": [1.0, 500, 1500, "Get Request"], "isController": false}, {"data": [0.0, 500, 1500, "JDBC Request"], "isController": false}, {"data": [0.5, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Request 22"], "isController": false}, {"data": [1.0, 500, 1500, "Samurai 8"], "isController": false}, {"data": [1.0, 500, 1500, "Samurai 9"], "isController": false}, {"data": [1.0, 500, 1500, "Samurai 20"], "isController": false}, {"data": [1.0, 500, 1500, "Request Ros Schindler"], "isController": false}, {"data": [1.0, 500, 1500, "Samurai 7"], "isController": false}, {"data": [1.0, 500, 1500, "Request 29"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50, 0, 0.0, 960.22, 16, 14976, 302.5, 990.2999999999997, 7415.449999999957, 14976.0, 3.3386752136752134, 17.182635445880074, 0.1578697791466346], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["JDBC Hitter", 1, 0, 0.0, 12971.0, 12971, 12971, 12971.0, 12971.0, 12971.0, 12971.0, 0.07709505820676894, 0.010088611132526406, 0.0], "isController": false}, {"data": ["Delete Request", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 3.2150466720779223, 0.6690087256493507], "isController": false}, {"data": ["Get Loco Weather", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 1.4869179475587702, 0.3531871609403255], "isController": false}, {"data": ["Samurai 15", 4, 0, 0.0, 255.25, 171, 313, 268.5, 313.0, 313.0, 313.0, 6.349206349206349, 0.0, 0.0], "isController": false}, {"data": ["Put Request", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 3.4132887380191694, 0.6864017571884984], "isController": false}, {"data": ["Get FTP Request", 1, 0, 0.0, 1910.0, 1910, 1910, 1910.0, 1910.0, 1910.0, 1910.0, 0.5235602094240839, 0.037835405759162305, 0.0], "isController": false}, {"data": ["Assertion R Test", 10, 0, 0.0, 555.0, 467, 846, 509.5, 824.3000000000001, 846.0, 846.0, 6.798096532970768, 152.06624957511895, 0.7900131713120326], "isController": false}, {"data": ["Request 8", 2, 0, 0.0, 213.5, 193, 234, 213.5, 234.0, 234.0, 234.0, 2.1786492374727673, 0.0, 0.0], "isController": false}, {"data": ["Soap WSDL Request", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 27.013699055666002, 0.15823030566600396], "isController": false}, {"data": ["Request Ivanovich Baklanov", 3, 0, 0.0, 256.0, 216, 298, 254.0, 298.0, 298.0, 298.0, 3.3783783783783785, 0.0, 0.0], "isController": false}, {"data": ["Request Ahmed Sheriff", 4, 0, 0.0, 284.25, 141, 352, 322.0, 352.0, 352.0, 352.0, 4.102564102564102, 0.0, 0.0], "isController": false}, {"data": ["Request 1", 2, 0, 0.0, 201.5, 150, 253, 201.5, 253.0, 253.0, 253.0, 3.2679738562091503, 0.0, 0.0], "isController": false}, {"data": ["Post FTP Request", 1, 0, 0.0, 2870.0, 2870, 2870, 2870.0, 2870.0, 2870.0, 2870.0, 0.34843205574912894, 0.0, 0.025179660278745644], "isController": false}, {"data": ["Request 15", 2, 0, 0.0, 161.0, 143, 179, 161.0, 179.0, 179.0, 179.0, 3.2414910858995136, 0.0, 0.0], "isController": false}, {"data": ["Get Request", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 135.1318359375, 7.8125], "isController": false}, {"data": ["JDBC Request", 1, 0, 0.0, 14976.0, 14976, 14976, 14976.0, 14976.0, 14976.0, 14976.0, 0.06677350427350429, 0.008737939035790598, 0.0], "isController": false}, {"data": ["Post Request", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 849.0, 1.1778563015312131, 1.2779280771495878, 0.27030881919905775], "isController": false}, {"data": ["Request 22", 2, 0, 0.0, 230.5, 120, 341, 230.5, 341.0, 341.0, 341.0, 2.4479804161566707, 0.0, 0.0], "isController": false}, {"data": ["Samurai 8", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.0, 0.0], "isController": false}, {"data": ["Samurai 9", 2, 0, 0.0, 201.5, 105, 298, 201.5, 298.0, 298.0, 298.0, 4.750593824228028, 0.0, 0.0], "isController": false}, {"data": ["Samurai 20", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 0.0, 0.0], "isController": false}, {"data": ["Request Ros Schindler", 3, 0, 0.0, 155.66666666666666, 115, 199, 153.0, 199.0, 199.0, 199.0, 3.7974683544303796, 0.0, 0.0], "isController": false}, {"data": ["Samurai 7", 2, 0, 0.0, 173.5, 133, 214, 173.5, 214.0, 214.0, 214.0, 2.4479804161566707, 0.0, 0.0], "isController": false}, {"data": ["Request 29", 2, 0, 0.0, 295.0, 283, 307, 295.0, 307.0, 307.0, 307.0, 2.6007802340702213, 0.0, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
