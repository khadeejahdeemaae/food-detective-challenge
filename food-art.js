function renderCuteFoodArt(target, food) {
  target.classList.add("food-art");
  target.setAttribute("aria-label", food.word || "food");
  target.innerHTML = "";

  const image = new Image();
  image.className = "real-food-photo";
  image.alt = food.word || "food";

  image.addEventListener("load", () => {
    target.classList.add("has-real-photo");
  });

  image.addEventListener("error", () => {
    target.classList.remove("has-real-photo");
    target.innerHTML = buildFoodSvg(food);
  });

  target.appendChild(image);
  image.src = getFoodImagePath(food);
}

function getFoodImagePath(food) {
  if (food.image) {
    return food.image;
  }

  return `assets/foods/${slugFoodName(food.word)}.jpg`;
}

function slugFoodName(value) {
  return String(value || "food")
    .trim()
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFoodSvg(food) {
  const word = String(food.word || "").toLowerCase();
  const label = escapeSvg(food.word || "Food");
  const type = getFoodType(word);
  const colors = getFoodColors(word, type);
  const body = buildFoodBody(type, colors, word);

  return `
    <svg class="cute-food-svg" viewBox="0 0 220 220" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="plateGlow-${colors.id}" cx="35%" cy="24%" r="75%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="55%" stop-color="#fff6d9"/>
          <stop offset="100%" stop-color="#cdefff"/>
        </radialGradient>
        <linearGradient id="main-${colors.id}" x1="28%" y1="8%" x2="76%" y2="95%">
          <stop offset="0%" stop-color="${colors.light}"/>
          <stop offset="58%" stop-color="${colors.base}"/>
          <stop offset="100%" stop-color="${colors.dark}"/>
        </linearGradient>
        <linearGradient id="soft-${colors.id}" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${colors.light}" stop-opacity="0.55"/>
        </linearGradient>
        <filter id="foodShadow-${colors.id}" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#50385f" flood-opacity="0.28"/>
        </filter>
      </defs>
      <ellipse cx="110" cy="178" rx="82" ry="18" fill="#4b3a65" opacity="0.18"/>
      <ellipse cx="110" cy="168" rx="92" ry="31" fill="url(#plateGlow-${colors.id})" stroke="#ffffff" stroke-width="8"/>
      <ellipse cx="110" cy="166" rx="63" ry="16" fill="#98dfff" opacity="0.16"/>
      <g filter="url(#foodShadow-${colors.id})">
        ${body}
      </g>
      <circle cx="76" cy="55" r="13" fill="#ffffff" opacity="0.52"/>
      <circle cx="92" cy="42" r="6" fill="#ffffff" opacity="0.62"/>
    </svg>
  `;
}

function getFoodType(word) {
  if (["apple", "orange", "tomato", "peach", "mango", "avocado", "onion", "potato"].some((name) => word.includes(name))) return "round";
  if (word.includes("banana")) return "banana";
  if (word.includes("grape") || word.includes("cherry")) return "cluster";
  if (word.includes("watermelon")) return "watermelon";
  if (word.includes("strawberry")) return "strawberry";
  if (["milk", "water", "juice", "tea", "coffee", "smoothie", "lemonade", "hot chocolate"].some((name) => word.includes(name))) return "drink";
  if (["rice", "noodle", "soup", "cereal", "salad", "lettuce", "corn"].some((name) => word.includes(name))) return "bowl";
  if (word.includes("bread") || word.includes("sandwich")) return "bread";
  if (["cake", "cupcake", "pancake"].some((name) => word.includes(name))) return "cake";
  if (word.includes("cookie")) return "cookie";
  if (word.includes("croissant")) return "croissant";
  if (word.includes("doughnut")) return "doughnut";
  if (word.includes("pretzel")) return "pretzel";
  if (word.includes("egg")) return "egg";
  if (word.includes("cheese")) return "cheese";
  if (word.includes("fish")) return "fish";
  if (word.includes("shrimp")) return "shrimp";
  if (word.includes("chicken")) return "chicken";
  if (word.includes("meat") || word.includes("sausage")) return "meat";
  if (word.includes("carrot")) return "carrot";
  if (word.includes("broccoli")) return "broccoli";
  if (word.includes("cucumber")) return "cucumber";
  if (word.includes("mushroom")) return "mushroom";
  return "round";
}

function getFoodColors(word, type) {
  const palettes = {
    apple: ["#ff9fb3", "#ef426f", "#a91d43"],
    orange: ["#ffd36d", "#ff9f1c", "#d56a00"],
    banana: ["#fff0a8", "#ffd84d", "#d49a00"],
    grape: ["#c9a7ff", "#8d6bff", "#5734b8"],
    watermelon: ["#67e895", "#2bc56f", "#16834b"],
    strawberry: ["#ff9db4", "#f03662", "#ad1f44"],
    tomato: ["#ff9b88", "#f45a42", "#b92d20"],
    carrot: ["#ffc27c", "#ff8a24", "#c55a08"],
    broccoli: ["#94ed9b", "#38b95b", "#167a37"],
    cucumber: ["#baf29f", "#65c96b", "#2b8c4c"],
    potato: ["#e7c38d", "#b7834c", "#7a4f29"],
    onion: ["#f3d5ff", "#bd84df", "#7f54a2"],
    milk: ["#ffffff", "#d9f4ff", "#8bcceb"],
    water: ["#dff9ff", "#7bd9ff", "#2197d2"],
    juice: ["#ffe28a", "#ffaf30", "#df7514"],
    tea: ["#e7bc73", "#b77833", "#734318"],
    coffee: ["#c28a55", "#74401d", "#3a2215"],
    rice: ["#ffffff", "#f2ead0", "#cfc2a3"],
    bread: ["#ffd9a0", "#d99445", "#a35b22"],
    cheese: ["#ffe66d", "#ffc845", "#dc9318"],
    meat: ["#ff9a8a", "#db4a3e", "#92302a"],
    fish: ["#b8f4ff", "#55bfe8", "#2375a7"],
    egg: ["#ffffff", "#fff4c7", "#e6c46f"],
    default: ["#fff0a8", "#ffbd59", "#c77918"]
  };

  const key = Object.keys(palettes).find((name) => word.includes(name)) || type;
  const [light, base, dark] = palettes[key] || palettes.default;
  return { id: `${type}-${Math.abs(hashWord(word))}`, light, base, dark };
}

function buildFoodBody(type, colors, word) {
  const fill = `url(#main-${colors.id})`;
  const shine = `url(#soft-${colors.id})`;

  if (type === "banana") {
    return `
      <path d="M54 112 C86 162 153 161 179 96 C150 128 99 133 73 88 C66 94 59 102 54 112Z" fill="${fill}" stroke="#fff4bf" stroke-width="8"/>
      <path d="M78 102 C103 130 139 130 163 108" fill="none" stroke="#fff8cf" stroke-width="9" stroke-linecap="round" opacity="0.75"/>
      <circle cx="176" cy="94" r="7" fill="#6f4b1e"/>
    `;
  }

  if (type === "cluster") {
    const grape = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#ffffff" stroke-width="5"/>`;
    return `
      <path d="M112 60 C122 48 135 47 145 53" fill="none" stroke="#4d8a34" stroke-width="8" stroke-linecap="round"/>
      ${grape(89, 83, 23)} ${grape(123, 82, 23)} ${grape(75, 116, 24)} ${grape(110, 119, 26)} ${grape(145, 113, 23)} ${grape(96, 151, 22)} ${grape(131, 148, 22)}
      <circle cx="82" cy="76" r="7" fill="#fff" opacity="0.58"/>
    `;
  }

  if (type === "watermelon") {
    return `
      <path d="M48 122 C64 61 156 50 180 122 C148 158 83 160 48 122Z" fill="#2cc86f" stroke="#ffffff" stroke-width="7"/>
      <path d="M62 119 C78 74 147 70 166 119 C139 143 91 145 62 119Z" fill="#ff5c80"/>
      <path d="M62 119 C91 145 139 143 166 119" fill="none" stroke="#fff0a3" stroke-width="7"/>
      <circle cx="97" cy="112" r="4" fill="#24304f"/><circle cx="126" cy="105" r="4" fill="#24304f"/><circle cx="139" cy="125" r="4" fill="#24304f"/>
    `;
  }

  if (type === "strawberry") {
    return `
      <path d="M110 55 C152 56 177 91 159 129 C146 158 118 171 110 174 C102 171 74 158 61 129 C43 91 68 56 110 55Z" fill="${fill}" stroke="#ffffff" stroke-width="7"/>
      <path d="M86 63 L104 76 L122 62 L119 85 L96 85Z" fill="#45b75c"/>
      <circle cx="88" cy="103" r="4" fill="#fff2a8"/><circle cx="119" cy="96" r="4" fill="#fff2a8"/><circle cx="136" cy="124" r="4" fill="#fff2a8"/><circle cx="102" cy="139" r="4" fill="#fff2a8"/>
    `;
  }

  if (type === "drink") {
    return `
      <path d="M68 62 H152 L143 163 Q141 176 128 176 H92 Q79 176 77 163Z" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
      <path d="M78 79 H142 L135 157 Q134 166 125 166 H95 Q86 166 85 157Z" fill="${fill}"/>
      <path d="M85 92 H136" stroke="${shine}" stroke-width="9" stroke-linecap="round" opacity="0.72"/>
      <path d="M150 91 Q176 101 158 128" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
      <path d="M104 54 L133 33" stroke="#ff7ca1" stroke-width="8" stroke-linecap="round"/>
    `;
  }

  if (type === "bowl") {
    return `
      <ellipse cx="110" cy="101" rx="70" ry="35" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
      <ellipse cx="110" cy="97" rx="57" ry="24" fill="${fill}"/>
      <path d="M48 100 H172 C166 145 146 172 110 172 C74 172 54 145 48 100Z" fill="#ffffff" stroke="#ffffff" stroke-width="7"/>
      <path d="M63 111 H157 C150 142 135 158 110 158 C85 158 70 142 63 111Z" fill="#b9edff"/>
      <circle cx="89" cy="92" r="8" fill="${colors.light}"/><circle cx="114" cy="88" r="7" fill="${colors.dark}" opacity="0.55"/><circle cx="134" cy="98" r="8" fill="${colors.base}"/>
    `;
  }

  if (type === "bread") {
    return `
      <path d="M57 98 C57 64 82 45 109 58 C136 45 163 64 163 98 V149 Q163 169 143 169 H77 Q57 169 57 149Z" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      <path d="M74 103 C94 88 126 88 146 104" fill="none" stroke="#fff2cb" stroke-width="10" stroke-linecap="round" opacity="0.72"/>
      <circle cx="91" cy="130" r="6" fill="${colors.dark}" opacity="0.25"/><circle cx="130" cy="121" r="5" fill="${colors.dark}" opacity="0.2"/>
    `;
  }

  if (type === "cake") {
    return `
      <path d="M55 93 H166 V151 Q166 169 148 169 H73 Q55 169 55 151Z" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      <path d="M55 94 Q83 72 111 94 Q139 72 166 94 V112 H55Z" fill="#fff5f8"/>
      <circle cx="87" cy="77" r="8" fill="#ff5d8f"/><circle cx="132" cy="78" r="8" fill="#ffd84d"/>
      <path d="M77 130 H146" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.58"/>
    `;
  }

  if (type === "cookie" || type === "doughnut") {
    const hole = type === "doughnut" ? `<circle cx="110" cy="113" r="28" fill="#fff7dd" stroke="#ffffff" stroke-width="6"/>` : "";
    return `
      <circle cx="110" cy="112" r="58" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      ${hole}
      <circle cx="89" cy="94" r="6" fill="#6e3f20"/><circle cx="132" cy="106" r="6" fill="#6e3f20"/><circle cx="103" cy="139" r="6" fill="#6e3f20"/>
      <path d="M78 81 C98 68 127 70 144 86" fill="none" stroke="#fff0c2" stroke-width="9" stroke-linecap="round" opacity="0.7"/>
    `;
  }

  if (type === "egg") {
    return `
      <ellipse cx="110" cy="115" rx="56" ry="69" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
      <circle cx="111" cy="126" r="25" fill="#ffd84d" stroke="#ffb33c" stroke-width="5"/>
      <path d="M82 82 C98 70 123 69 138 83" fill="none" stroke="#e8fbff" stroke-width="9" stroke-linecap="round"/>
    `;
  }

  if (type === "cheese") {
    return `
      <path d="M53 138 L165 75 L165 160 H62 Q52 160 53 138Z" fill="${fill}" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="119" cy="125" r="10" fill="#ffef9b" opacity="0.9"/><circle cx="145" cy="101" r="7" fill="#ffef9b" opacity="0.9"/><circle cx="88" cy="143" r="6" fill="#ffef9b" opacity="0.9"/>
    `;
  }

  if (type === "fish") {
    return `
      <path d="M57 113 C83 77 139 77 164 113 C139 150 83 150 57 113Z" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      <path d="M164 113 L190 89 V137Z" fill="${colors.dark}" stroke="#ffffff" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="87" cy="106" r="6" fill="#24304f"/>
      <path d="M112 90 L102 112 L114 135" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
    `;
  }

  if (type === "shrimp") {
    return `
      <path d="M72 123 C78 75 150 69 160 114 C167 144 134 170 99 153 C122 149 141 132 135 112 C129 92 96 94 92 125Z" fill="${fill}" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="90" cy="99" r="5" fill="#24304f"/>
      <path d="M154 97 C173 86 184 88 193 99" fill="none" stroke="${colors.dark}" stroke-width="7" stroke-linecap="round"/>
    `;
  }

  if (type === "chicken" || type === "meat") {
    return `
      <path d="M64 111 C68 77 103 64 130 84 C155 103 151 146 120 160 C88 174 58 146 64 111Z" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      <circle cx="151" cy="143" r="13" fill="#fff4d7" stroke="#ffffff" stroke-width="6"/>
      <rect x="129" y="133" width="38" height="15" rx="8" fill="#fff4d7" stroke="#ffffff" stroke-width="5"/>
      <path d="M83 96 C99 83 121 83 136 99" fill="none" stroke="#ffd7cd" stroke-width="8" stroke-linecap="round"/>
    `;
  }

  if (type === "carrot") {
    return `
      <path d="M86 62 C104 92 126 119 148 160 C112 154 84 136 62 105 C71 91 78 77 86 62Z" fill="${fill}" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
      <path d="M80 63 C72 45 80 34 96 51 C102 34 119 35 115 57 C135 47 144 59 123 70" fill="#45c46a" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M86 103 L111 94 M101 132 L130 126" stroke="#fff3c2" stroke-width="6" stroke-linecap="round" opacity="0.62"/>
    `;
  }

  if (type === "broccoli") {
    return `
      <rect x="94" y="104" width="31" height="62" rx="14" fill="#7fc35d" stroke="#ffffff" stroke-width="6"/>
      <circle cx="80" cy="91" r="27" fill="${fill}" stroke="#ffffff" stroke-width="7"/>
      <circle cx="113" cy="78" r="31" fill="${fill}" stroke="#ffffff" stroke-width="7"/>
      <circle cx="141" cy="99" r="27" fill="${fill}" stroke="#ffffff" stroke-width="7"/>
      <circle cx="102" cy="107" r="25" fill="${colors.dark}" opacity="0.5"/>
    `;
  }

  if (type === "cucumber") {
    return `
      <rect x="54" y="92" width="112" height="48" rx="24" fill="${fill}" stroke="#ffffff" stroke-width="8" transform="rotate(-12 110 116)"/>
      <circle cx="84" cy="114" r="5" fill="#e9ffd5"/><circle cx="116" cy="106" r="5" fill="#e9ffd5"/><circle cx="143" cy="101" r="5" fill="#e9ffd5"/>
    `;
  }

  if (type === "mushroom") {
    return `
      <path d="M57 101 C65 62 154 62 163 101 C145 116 75 116 57 101Z" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
      <path d="M91 103 H130 L138 163 H83Z" fill="#fff5df" stroke="#ffffff" stroke-width="7"/>
      <circle cx="91" cy="88" r="7" fill="#ffffff" opacity="0.82"/><circle cx="128" cy="83" r="8" fill="#ffffff" opacity="0.82"/>
    `;
  }

  return `
    <circle cx="110" cy="112" r="57" fill="${fill}" stroke="#ffffff" stroke-width="8"/>
    <path d="M111 54 C116 42 128 40 138 45" fill="none" stroke="#4d8a34" stroke-width="8" stroke-linecap="round"/>
    <path d="M123 58 C137 49 153 55 159 70 C143 73 130 69 123 58Z" fill="#62c96d" stroke="#ffffff" stroke-width="5"/>
    <path d="M80 82 C95 68 126 66 145 84" fill="none" stroke="${shine}" stroke-width="10" stroke-linecap="round" opacity="0.72"/>
  `;
}

function hashWord(word) {
  return String(word).split("").reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
}

function escapeSvg(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
