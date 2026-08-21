const fs = require('fs');
let code = fs.readFileSync('c:\\Users\\DELL\\Desktop\\NBrain\\nbrain-portal\\app.js', 'utf8');

const regex = /const activeTabEl = document\.querySelector\(`\.tab\[data-target="\$\{targetId\}"\]`\);[\s\S]*?activeTabEl\.scrollIntoView\([\s\S]*?\);[\s\S]*?\}/;

const replacement = `const activeTabEl = document.querySelector(\`.tab[data-target="\${targetId}"]\`);
    const tabsNav = document.getElementById('mainTabsNav') || document.querySelector('.tabs');
    if (activeTabEl && tabsNav) {
      const tabLeft = activeTabEl.offsetLeft;
      const tabWidth = activeTabEl.offsetWidth;
      const containerWidth = tabsNav.offsetWidth;
      tabsNav.scrollTo({
        left: tabLeft - (containerWidth / 2) + (tabWidth / 2),
        behavior: 'smooth'
      });
    }`;

code = code.replace(regex, replacement);
fs.writeFileSync('c:\\Users\\DELL\\Desktop\\NBrain\\nbrain-portal\\app.js', code, 'utf8');
console.log('REPLACED_DONE');
