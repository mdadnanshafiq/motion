const btnContainer = document.getElementById('btnContainer');
const videoBox = document.getElementById('videoBox');
const empty = document.getElementById('empty');
const sortBtn = document.getElementById('sortBtn');

let selectedCat = 1000;
let sortStatus = false;

sortBtn.addEventListener('click', () => {
    sortStatus = true;
    fetchByCategory(selectedCat, sortStatus);
})

const fetchCategories = async () => {
    const url = 'https://openapi.programming-hero.com/api/videos/categories';
    const res = await fetch(url);
    const data = await res.json();
    const category = data.data;
    console.log(category);
    category.forEach(item => {
        const newBtn = document.createElement('button');
        newBtn.innerText = item.category;
        newBtn.classList = `btn catBtn`;
        newBtn.addEventListener('click', () => {
            fetchByCategory(item.category_id);
            const catBtn = document.getElementsByClassName('catBtn');
            for (let btn of catBtn) {
                btn.classList.remove('bg-red-600');
            }
            newBtn.classList.add('bg-red-600');
        });
        btnContainer.appendChild(newBtn);
    });
}

const fetchByCategory = async (categoryID, sortStatus) => {
    const url = ` https://openapi.programming-hero.com/api/videos/category/${categoryID}`;
    selectedCat = categoryID;
    const res = await fetch(url);
    const data = await res.json();
    const categoryData = data.data;

    if (sortStatus) {
        categoryData.sort((a, b) => {
            const firstView = a.others?.views;
            const secondView = b.others?.views;
            const firstViewNum = parseFloat(firstView.replace('K', '')) || 0;
            const secondViewNum = parseFloat(secondView.replace('K', '')) || 0;
            return secondViewNum - firstViewNum;

        })
    }

    if (categoryData.length < 1) {
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
    }
    console.log(categoryData);
    videoBox.innerHTML = '';
    categoryData.forEach(item => {
        const div = document.createElement('div');
        div.classList = `card w-80 bg-base-100 shadow-xl`;
        div.innerHTML = `
        <figure class='w-[300px] h-[169px] mx-auto relative'><img src="${item.thumbnail}" alt="" />
        <div class='absolute bottom-4 right-4 bg-[#000000] rounded-lg p-1 text-white'>${item.others.posted_date ? new Date(item.others.posted_date * 1000).toISOString().slice(11, -8) : 'N/A'}</div>
        </figure>
        <div class="card-body flex flex-row justify-center gap-6 w-full items-start">
            <div class="size-[60px]">
                <img src="${item.authors[0].profile_picture}" class="size-full rounded-full" alt="">
            </div>
            <div>
                <h2 class=" font-bold">
                ${item.title}
                </h2>
                <p class="text-gray-600">${item.authors[0].profile_name} <span class=''><i
                            class="fa-solid text-blue-400 ${item.authors[0].verified ? 'fa-circle-check' : ''} "></i></span></p>
                <p class="text-gray-600">${item.others.views} views</p>
            </div>
        </div>
        `;
        videoBox.appendChild(div);
        // console.log(new Date(item.others.posted_date * 1000).toISOString().slice(11, -8));
    })
};
fetchByCategory(selectedCat, sortStatus);
fetchCategories();