document.addEventListener('DOMContentLoaded', function() {
    const startYearInput = document.getElementById('startYear');
    const endYearInput = document.getElementById('endYear');
    const queryButton = document.getElementById('queryButton');
    const yearRangeDisplay = document.getElementById('yearRangeDisplay');

    queryButton.addEventListener('click', updateData);

    startYearInput.addEventListener('input', updateYearRangeDisplay);
    endYearInput.addEventListener('input', updateYearRangeDisplay);

    updateData();

    // 更新範圍顯示
    function updateYearRangeDisplay() {
        const startYear = startYearInput.value;
        const endYear = endYearInput.value;
        yearRangeDisplay.innerText = `${startYear} ~ ${endYear}`;

        // 確保 End 不會小於 start
        endYearInput.min = startYear;
    }

    function updateData() {
        const startYear = parseInt(startYearInput.value);
        const endYear = parseInt(endYearInput.value);

        updateYearRangeDisplay();

        fetch('/api/prices')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(row => row.year >= startYear && row.year <= endYear);

                // 更新表格
                const tableBody = document.getElementById('eggPricesTableBody');
                tableBody.innerHTML = ''; // 清空當前表格
                filteredData.forEach(row => {
                    const tr = document.createElement('tr');
                    const yearTd = document.createElement('td');
                    const priceTd = document.createElement('td');

                    yearTd.textContent = row.year;
                    priceTd.textContent = row.price;

                    tr.appendChild(yearTd);
                    tr.appendChild(priceTd);

                    tableBody.appendChild(tr);
                });

                // 更新圖表
                const years = filteredData.map(row => row.year);
                const prices = filteredData.map(row => row.price);

                // 清除已存在的表格
                const existingChart = Chart.getChart('priceChart');
                if (existingChart) {
                    existingChart.destroy();
                }

                const ctx = document.getElementById('priceChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: years,
                        datasets: [{
                            label: 'Price Trend',
                            data: prices,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price'
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
});
