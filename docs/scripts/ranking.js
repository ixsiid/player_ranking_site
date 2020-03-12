const Ranking = function () { };

Ranking.get = (url, tbody_query) => {
    fetch(url)
        .then(res => res.json())
        .then(json => {
            const tbody = document.querySelector(tbody_query || '#ranking_body');
            tbody.textContent = '';

            const template = document.querySelector('#ranking_template');
            const data = json.data
                .map((x, i) => ({
                    name: x[json.header.indexOf('name')],
                    score: x[json.header.indexOf('score')],
                    date: `(${new Date(x[json.header.indexOf('date')]).toISOString().substr(0, 10)})`,
                    line: i,
                    uid: x[json.header.indexOf('id')],
                }));
            data.map(x => x.uid)
                .filter((x, i, a) => a.indexOf(x) == i)
                .map(uid => data.filter(x => x.uid == uid).reduce((a, b) => a.score > b.score ? a : b))
                .sort((a, b) => a.score > b.score)
                .forEach((x, i) => {
                    const tr = document.importNode(template.content, true);
                    tr.querySelector('.rank').textContent = i + 1;
                    tr.querySelector('.name').textContent = x.name;
                    tr.querySelector('.score').textContent = x.score;
                    tr.querySelector('.date').textContent = x.date;
                    Object.defineProperty(tr.querySelector('.download'), 'download_info', {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: {
                            line: x.line,
                            rank: i + 1,
                            url
                        }
                    });
                    tbody.appendChild(tr);
                });
        })
        .catch(console.error);

    if (!('download_detail' in window)) {
        const download_element = document.createElement('a');
        download_element.style.display = 'none';
        document.body.appendChild(download_element);
        window.download_detail = sender => {
            const line = sender.download_info.line;
            const rank = sender.download_info.rank;
            const url = sender.download_info.url;
            fetch(`${url}?line=${line}`)
                .then(res => res.json())
                .then(json => {
                    download_element.href = window.URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'text.plain' }));
                    download_element.download = `${new Date().toISOString().substr(0, 10)}_rank_${rank}.json`;
                    download_element.click();
                }).catch(console.error);
        }
    }
};

export default Ranking;
