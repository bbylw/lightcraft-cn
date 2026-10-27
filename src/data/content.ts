export const nav = [
  { label: '面板', href: '/panels' },
  { label: '显影', href: '/develop' },
  { label: '智能体', href: '/engine' },
  { label: '状态', href: '/status' },
]

export const hero = {
  claim: ['在场景光里', '显影'],
  lede:
    'LightCraft 是一个开源、非破坏性的照片图库与 raw 显影工具，用纯 Rust 写；桌面安装包与网页版共用同一套界面。',
  primary: { label: '下载 LightCraft', href: 'https://getartcraft.com/apps/lightcraft' },
  secondary: { label: '先在浏览器里调一张', href: '#bench' },
  facts: [
    { value: '4 ms', label: '在 24 MP raw 上拖动一次滑块的重新渲染（Apple M4 Pro）' },
    { value: '1/255', label: 'GPU 与 CPU 两条管线的差异上限' },
    { value: '11 种', label: '可解码的 raw 格式' },
    { value: 'MIT', label: 'MIT 或 Apache-2.0 双许可' },
  ],
  plate: {
    src: '/images/hero-tetons.webp',
    alt: 'LightCraft 的编辑视图：照片铺满窗口，右侧是显影面板，底部是胶片窗格',
    name: '开发窗口',
    note: '照片、显影面板与胶片窗格在同一屏；桌面端与网页版是同一套界面。',
  },
}

export const claims = {
  heading: '四条约束',
  lead: '不是功能清单，是这台工具不能违背的四件事。',
  rows: [
    {
      term: '非破坏性',
      body: '所有调整只是叠加的一层，原文件始终不动；随时可以回到打开时的那一张。',
      to: '/develop',
      link: '看显影管线',
    },
    {
      term: '线性光',
      body:
        '曝光、高光、阴影与对比度都在场景光里算，工作空间是 Rec.2020；色域用映射而不是裁剪，导出时才落到目标色彩空间。',
      to: '/develop',
      link: '看显影管线',
    },
    {
      term: '皆命令',
      body:
        '每一个菜单项、滑块、画笔笔触与裁剪手柄都有稳定 ID 和 JSON 参数；界面、键盘、CLI、JSON-lines 与 MCP 共用一个入口。',
      to: '/engine',
      link: '看命令表',
    },
    {
      term: '同一套界面',
      body:
        'macOS、Windows 与 Linux 是原生安装包；网页版经 WebAssembly 跑同一套界面，图库存在浏览器里。',
      to: '/status',
      link: '看网页版进度',
    },
  ],
}

export const bench = {
  heading: '自己动手调一次',
  lead: '这就是 LightCraft 的显影管线：在线性光里改曝光、高光、阴影与对比度，曲线在 log 亮度上单调映射。',
  hint: '拖动右边的滑块，或者直接拖动照片下方曲线上的控制点。每一次改动都会变成一条命令。',
  controls: [
    { key: 'exposure', label: '曝光', min: -2, max: 2, step: 0.05, unit: 'EV' },
    { key: 'highlights', label: '高光', min: -100, max: 100, step: 1, unit: '' },
    { key: 'shadows', label: '阴影', min: -100, max: 100, step: 1, unit: '' },
    { key: 'contrast', label: '对比度', min: -100, max: 100, step: 1, unit: '' },
    { key: 'clarity', label: '清晰度', min: 0, max: 100, step: 1, unit: '' },
    { key: 'texture', label: '纹理', min: 0, max: 100, step: 1, unit: '' },
    { key: 'vignette', label: '暗角', min: 0, max: 100, step: 1, unit: '' },
    { key: 'grain', label: '颗粒', min: 0, max: 100, step: 1, unit: '' },
  ] as const,
  curveLabel: '色调曲线',
}

export const panels = {
  heading: '八个切面，同一条管线',
  lead:
    '下面每一块都是 LightCraft 开发窗口的原始截图。滑块、曲线、色轮与蒙版不是各画各的，它们都是这条线性光显影管线上的算子；桌面安装包与网页版长得一模一样。',
  rows: [
    {
      name: 'Light',
      note: '曝光、对比度、高光、阴影、白色色阶与黑色色阶',
      spec: '6 个滑块',
      img: '/images/ui/light.webp',
      alt: 'Light 面板：曝光、对比度、高光、阴影、白色色阶与黑色色阶六个滑块',
    },
    {
      name: 'Tone Curve',
      note: '参数化区域曲线加 RGB 点曲线，构造上单调',
      spec: '单调映射',
      img: '/images/ui/curve.webp',
      alt: '色调曲线面板：上排是点曲线与 RGB 三个通道按钮，下方是带控制点的曲线网格',
    },
    {
      name: 'Color Grading',
      note: '阴影、中间调、高光三路色轮，各自独立',
      spec: '3 路色轮',
      img: '/images/ui/grading.webp',
      alt: '颜色分级面板：中间调、阴影与高光三个色轮，每个色轮中央有一个取色点',
    },
    {
      name: '预设',
      note: '十八个手工预设，每个带 0 到 200% 的数量',
      spec: '18 个预设',
      img: '/images/ui/presets.webp',
      alt: '预设列表：B&W 与 Color 两组，展开的预设名逐条列出',
    },
    {
      name: 'Color',
      note: '白平衡、色温、色调、鲜艳度与饱和度',
      spec: '4 个滑块',
      img: '/images/ui/color.webp',
      alt: 'Color 面板：白平衡模式下有色温、色调、鲜艳度与饱和度四个滑块',
    },
    {
      name: '新建蒙版',
      note: '画笔、线性、径向、亮度与颜色范围',
      spec: '8 个工具',
      img: '/images/ui/mask-tools.webp',
      alt: '新建蒙版的八个工具：主体、天空、背景、画笔、线性、径向、亮度、颜色',
    },
    {
      name: '颜色混合器',
      note: '八色段混合器，每色相都能单独调整',
      spec: '8 个色段',
      img: '/images/ui/mixer.webp',
      alt: '颜色混合器：红橙黄绿青蓝紫品红八个色块，紫色被选中，下方是色相、饱和度与明度滑块',
    },
    {
      name: '径向蒙版',
      note: '在画面上拖一个椭圆，只调这一块',
      spec: '15 项局部调整',
      img: '/images/ui/mask-overlay.webp',
      alt: '照片上覆盖着一个红色的径向蒙版椭圆，椭圆中央有一个蓝色控制点',
    },
  ],
  outro: {
    heading: '面板只是入口',
    body:
      '每一个滑块、按钮与手柄，背后都是同一条带 ID 的命令。界面之外的键盘、CLI 与智能体，用的是同一张命令表。',
    link: '看五个入口',
    to: '/engine',
  },
}

export const develop = {
  heading: '显影',
  lead:
    'LightCraft 的显影是一条线性浮点管线：曝光、高光、阴影与对比度都在场景光里算，色域用映射而不是裁剪，导出时才落到目标色彩空间。',
  specs: [
    { label: '工作空间', value: 'Rec.2020 · 线性浮点' },
    { label: '渲染', value: 'wgpu 计算内核' },
    { label: '一致性', value: 'GPU 与 CPU 差异 ≤ 1/255' },
    { label: '原文件', value: '只读，调整另存为一层' },
  ],
  guaranteesHeading: '两项保证',
  guarantees: [
    {
      name: '不改动原文件',
      note:
        '非破坏性编辑：所有调整只是一层叠加，随时可以回到打开时的那一张。XMP 附属文件与版本记录也在文件之外。',
    },
    {
      name: 'Rec.2020',
      note:
        '工作空间是线性浮点管线，色域映射代替裁剪，导出时才落到目标色彩空间；同一张 raw 换一个落点，不需要重做一遍。',
    },
  ],
  splitsHeading: '同一条管线，两种落点',
  splits: [
    {
      src: '/images/bw-split.webp',
      alt: '沙丘的分屏视图：左边彩色，右边带颗粒和暗角的黑白',
      caption: '沙丘：同一张底片，左边是彩色落点，右边是带颗粒与暗角的黑白落点。',
    },
    {
      src: '/images/grading-wheels.webp',
      alt: 'LightCraft 的颜色分级面板：阴影、中间调和高光的三路色轮',
      caption: '《移民母亲》：阴影、中间调与高光三路色轮，各自独立地落在同一张脸上。',
    },
  ],
}

export const speed = {
  heading: '看不见的速度',
  lead: '两个数字，来自一张 24 MP 的 raw 和一条完整的 wgpu 计算管线。',
  figures: [
    {
      value: '4 ms',
      note: '在 24 MP raw 上拖动一次滑块的重新渲染时间（Apple M4 Pro）。',
    },
    {
      value: '1/255',
      note: '整条显影管线作为 wgpu 计算内核运行，与 CPU 管线比对到的差异上限。',
    },
  ],
  photos: [
    {
      src: '/images/earthrise-frame.webp',
      alt: '阿波罗 8 号拍摄的地球：半明半暗的地球悬在黑色天空里',
      caption: '阿波罗 8 号，1968',
    },
    {
      src: '/images/earthrise-limb.webp',
      alt: '同一次飞行拍下的月球地平线：灰色的月壤铺满画面，上方是地球的边缘',
      caption: '月球地平线，同一卷胶片',
    },
  ],
}

export const engine = {
  heading: '智能体',
  lead:
    'LightCraft 里的每一个菜单项、滑块、画笔笔触、裁剪手柄和按键都是一个命令，拥有稳定的 ID 和 JSON 参数。界面、键盘、CLI、JSON-lines 控制通道和 MCP 服务器全都通过同一个入口分发。',
  entriesHeading: '五个入口',
  entriesLead: '同一张命令表，五种进法。智能体看到的是真实界面，不是侧门。',
  entries: [
    {
      name: '界面',
      note: '每一个菜单项与控件都有稳定的 ID，可以按名字点、拖、截图。',
      sample: 'slider:effects.clarity',
    },
    {
      name: '键盘',
      note: '网格、细节、编辑、裁剪、蒙版与预设都有单键快捷键，落在同一张命令表上。',
      sample: 'G · D · E · C · M',
    },
    {
      name: 'CLI',
      note: 'lightcraft-cli run 可以跑任意命令链，每条命令打印一行 JSON 结果。',
      sample: 'lightcraft-cli run --import in.dng develop.set …',
    },
    {
      name: 'JSON-lines',
      note: '控制通道按行收发 JSON-RPC；下面的四条请求就是原样。',
      sample: '{"method": "engine.execute", …}',
    },
    {
      name: 'MCP',
      note: 'lightcraft-cli mcp 把同一份注册表交给 Claude 或任何 MCP 客户端。',
      sample: 'lightcraft-cli mcp',
    },
  ],
  examplesHeading: '四条请求，原样发出',
  examplesLead: '每一行就是一条完整的请求；智能体可以挑片、显影、加蒙版，再截一张图看结果。',
  examples: [
    {
      lines: [
        ['{"method": "engine.execute",'],
        ['  "params": {'],
        ['    "command": ', 'photo.flag', ','],
        ['    "params": { "flag": "pick" }'],
        ['  }}'],
      ],
    },
    {
      lines: [
        ['{"method": "engine.execute",'],
        ['  "params": {'],
        ['    "command": ', 'develop.set', ','],
        ['    "params": { "values": {'],
        ['      "light.highlights": ', '-45', ','],
        ['      "light.shadows": ', '38'],
        ['    }}'],
        ['  }}'],
      ],
    },
    {
      lines: [
        ['{"method": "engine.execute",'],
        ['  "params": {'],
        ['    "command": ', 'mask.add', ','],
        ['    "params": { "kind": "radial",'],
        ['      "center": [0.62, 0.4],'],
        ['      "rx": 0.2, "ry": 0.14'],
        ['    }}'],
        ['  }}'],
      ],
    },
    {
      lines: [
        ['{"method": "ui.screenshot",'],
        ['  "params": { "path": ', 'after.png', ' }}'],
      ],
    },
  ],
  principlesHeading: '一条引擎优先的流水线',
  principles: [
    {
      name: '命令',
      text: '每一个控件都是带稳定 ID 和 JSON 参数的命令，所以智能体操作的是真实界面，而不是绕到侧门。',
    },
    {
      name: '引擎',
      text: '引擎优先的 Cargo 工作空间，强制 crate 分层，界面之下没有任何东西知道界面的存在。',
    },
    {
      name: '入口',
      text: 'lightcraft-cli run 跑命令链，每条打印一行 JSON；lightcraft-cli mcp 把注册表交给 Claude。',
    },
  ],
}

export const platforms = {
  heading: '哪儿都能跑',
  lead: '桌面安装包和网页版共用同一套界面；能读什么、能写什么、用什么写的，都写在仓库里。',
  names: ['macOS', 'Windows', 'Linux', 'WebAssembly'],
  groups: [
    {
      title: '原始格式',
      items: ['DNG · CR2 · CR3 · ARW · NEF', 'RAF · RW2 · RWL · PEF · ORF · SRW'],
    },
    {
      title: '导出格式',
      items: ['JPEG · PNG · TIFF · WebP · PSD', 'HEIC · HEIF（可选构建）'],
    },
    {
      title: '实现',
      items: ['Rust · wgpu'],
    },
    {
      title: '许可',
      items: ['MIT 或 Apache-2.0'],
    },
  ],
  rule: '不使用商业产品的图标、截图、预设、配置文件、LUT 或字体。',
}

export const contents = {
  heading: '四个地方，看完整台工具',
  lead: '首页只放最必要的几件事；其余内容各自成页，读完大约需要十分钟。',
  items: [
    {
      to: '/panels',
      name: '面板',
      line: '八个切面，以及每个面板到底管什么。',
      tag: '8 个面板',
    },
    {
      to: '/develop',
      name: '显影',
      line: '线性浮点管线的两项保证，和两个真实数字。',
      tag: '2 项保证 · 2 个数字',
    },
    {
      to: '/engine',
      name: '智能体',
      line: '五个入口、四条请求，和一张命令注册表。',
      tag: '5 个入口',
    },
    {
      to: '/status',
      name: '状态',
      line: '八个领域现在走到哪里，包括四个缺口。',
      tag: '4 已完成 · 3 进行中 · 1 未开始',
    },
  ],
}

export const evidence = {
  heading: '用真的照片，跑真的管线',
  lead:
    '界面里的展示照片都是公有领域的底片。这些不是效果图；下面的每一张，都是这套显影管线在它们身上跑出来的结果。',
  photos: [
    {
      src: '/images/migrant-mother.webp',
      alt: '多萝西娅·兰格《移民母亲》（1936），一位母亲抱着两个孩子的黑白照片',
      name: '《移民母亲》',
      note: '多萝西娅·兰格，1936。黑白混色器与蒙版在这张脸上工作。',
    },
    {
      src: '/images/blue-marble-split.webp',
      alt: 'LightCraft 的对比视图：《蓝色弹珠》修改前后的并排画面，右侧是显影面板',
      name: '《蓝色弹珠》',
      note: '阿波罗 17 号，1972。高光 −38、黑色色阶 −20、去朦胧 +15、鲜艳度 +30。',
    },
  ],
  clip: {
    src: '/video/mons-mouton-earthrise.webm',
    poster: '/images/earthrise-poster.webp',
    alt: '十秒循环：地球从月球山脊后面升起来',
    label: 'NASA 科学可视化工作室：地球从月球山脊后升起。',
  },
}

export const status = {
  heading: '状态',
  lead:
    '八个领域现在走到哪里：四个已经可用，三个还在路上，一个还没有开始；下面每一行都列出该领域已经做到的能力，缺口也一并写清楚。',
  summary: [
    { value: '4', label: '已完成' },
    { value: '3', label: '进行中' },
    { value: '1', label: '未开始' },
  ],
  progress:
    '按功能数量算，我们达到了约 79%（核心功能 98%）；作为日常使用的工具，更接近 60–70%。',
  entries: [
    {
      title: '图库',
      body: '相册、文件夹、智能相册、堆叠与虚拟副本，星级、旗标、标签、过滤栏、搜索与排序，照片网格与胶片窗格都做了虚拟化。',
      state: '已完成',
      tone: 'done',
      caps: ['相册 · 文件夹 · 智能相册', '自动堆叠与虚拟副本', '星级 · 旗标 · 标签', '过滤栏 · 搜索 · 排序', '网格与胶片窗格虚拟化', '导入与监视文件夹'],
    },
    {
      title: '显影',
      body: 'Light、Color、Effects、色调曲线、颜色混合器、点颜色、颜色分级与黑白，外加六套自带配置文件和十八个手工预设。',
      state: '已完成',
      tone: 'done',
      caps: ['Light · Color · Effects', '色调曲线与目标调整', '八色段颜色混合器', '颜色分级 · 校准 · 黑白', '六套配置文件 · 十八个预设', '版本与历史记录'],
    },
    {
      title: '蒙版',
      body: '画笔、线性、径向、亮度范围与颜色范围，支持添加、减去、相交与任意反相，每个蒙版可调十五项局部调整。',
      state: '已完成',
      tone: 'done',
      caps: ['画笔 · 线性 · 径向', '亮度与颜色范围', '添加 · 减去 · 相交', '任意反相', '每蒙版十五项局部调整', '主体与天空仍是启发式'],
    },
    {
      title: 'RAW',
      body: '解码 DNG、CR2、CR3、ARW、NEF、RAF、RW2、RWL、PEF、ORF、SRW 的传感器数据与嵌入预览；压缩的奥林巴斯 raw 目前使用预览。',
      state: '进行中',
      tone: 'wip',
      caps: ['十一种 raw 格式', '所有格式的嵌入预览', 'DNG 使用自带矩阵', 'C-RAW 无损解码', '富士 RAF 无损压缩', '索尼与富士配置文件'],
    },
    {
      title: '导出',
      body: 'JPEG、PNG、TIFF、WebP、AVIF、DNG 与原始格式，含尺寸调整、命名模板、水印与批处理，联系表 PDF 也在其中。',
      state: '已完成',
      tone: 'done',
      caps: ['JPEG · PNG · TIFF · WebP · AVIF', 'DNG 与原始格式', '尺寸调整与体积上限', '输出锐化 · 元数据策略', '命名模板与批处理', 'HDR 增益图导出'],
    },
    {
      title: '细节',
      body: '锐化、亮度与色彩降噪、污点去除、修复、红眼与宠物眼。AI 降噪与超分辨率尚未开始。',
      state: '进行中',
      tone: 'wip',
      caps: ['锐化', '亮度与色彩降噪', '污点去除与修复', '可视化斑点 · 红眼 · 宠物眼', '镜头校正与几何', '照片合并：HDR 与全景'],
    },
    {
      title: '网页版',
      body: '同一套界面经 WebAssembly 跑在浏览器里，图库存进 OPFS 与 IndexedDB，Web Worker 渲染，导出直接下载。',
      state: '进行中',
      tone: 'wip',
      caps: ['WASM 跑同一套界面', 'OPFS 与 IndexedDB', 'Web Worker 渲染', '导出直接下载', '静态站点 zip', '与桌面端共用一套界面'],
    },
    {
      title: 'AI',
      body: '分割蒙版、AI 降噪、超分辨率、人脸识别与视频支持目前都还没有开始，主体与天空选择仍是经典启发式算法。',
      state: '未开始',
      tone: 'todo',
      caps: ['分割蒙版', 'AI 降噪', '超分辨率', '人脸识别', '视频支持', '全部尚未开始'],
    },
  ],
  gaps: {
    heading: '最大的四个缺口',
    lead: '这些不是待办清单上的装饰，是日常使用里每天都会碰到的限制。',
    items: [
      {
        title: '相机色彩校准',
        body: '索尼、尼康、松下、富士和佳能 CR3 的 raw 只能拿到相机 JPEG 里的估计值；内置的十份配置文件不是实测校准。',
      },
      {
        title: '压缩的奥林巴斯 raw 与 CR3 变体',
        body: '这些格式在文件里带内嵌 JPEG 预览时改用预览解码，而不是传感器数据。',
      },
      {
        title: 'AI 蒙版与降噪',
        body: '主体和天空选择目前是经典启发式算法，AI 降噪与超分辨率尚未开始。',
      },
      {
        title: '屏幕上的 HDR 显示、视频与打印',
        body: 'HDR 导出已经可用，屏幕显示、视频和经典版式里的打印／画册／地图还没有。',
      },
    ],
  },
}

export const action = {
  heading: '开始显影',
  body: '从 getartcraft.com 下载 LightCraft。macOS、Windows 与 Linux 上是原生安装包，网页版是一个静态 zip。',
  cta: '下载 LightCraft',
  href: 'https://getartcraft.com/apps/lightcraft',
  facts: [
    { label: '原生安装包', value: 'macOS · Windows · Linux' },
    { label: '网页版', value: '一个静态 zip' },
    { label: '许可', value: 'MIT 或 Apache-2.0' },
    { label: '源码', value: 'GitHub 仓库', href: 'https://github.com/storytold/lightcraft' },
  ],
}

export const footer = {
  columns: [
    {
      title: '本站',
      links: [
        { label: '首页', href: '/' },
        { label: '面板', href: '/panels' },
        { label: '显影', href: '/develop' },
        { label: '智能体', href: '/engine' },
        { label: '状态', href: '/status' },
      ],
    },
    {
      title: 'Crafting Apps',
      links: [
        { label: 'PhotoCraft', href: 'https://getartcraft.com/apps/photocraft' },
        { label: 'VectorCraft', href: 'https://getartcraft.com/apps/vectorcraft' },
        { label: 'FilmCraft', href: 'https://getartcraft.com/apps/filmcraft' },
        { label: 'PdfCraft', href: 'https://getartcraft.com/apps/pdfcraft' },
        { label: 'EffectCraft', href: 'https://getartcraft.com/apps/effectcraft' },
        { label: 'DesignCraft', href: 'https://getartcraft.com/apps/designcraft' },
      ],
    },
    {
      title: 'LightCraft',
      links: [
        { label: '下载', href: 'https://getartcraft.com/apps/lightcraft' },
        { label: 'GitHub 仓库', href: 'https://github.com/storytold/lightcraft' },
        { label: '路线图', href: 'https://github.com/storytold/lightcraft/blob/main/ROADMAP.md' },
        { label: '控制协议', href: 'https://github.com/storytold/lightcraft/blob/main/docs/control-protocol.md' },
        { label: 'MCP 文档', href: 'https://github.com/storytold/lightcraft/blob/main/docs/mcp.md' },
        { label: '本地化', href: 'https://github.com/storytold/lightcraft/blob/main/docs/localization.md' },
      ],
    },
    {
      title: '参与',
      links: [
        { label: 'Discord', href: 'https://discord.gg/artcraft' },
        { label: '贡献指南', href: 'https://github.com/storytold/lightcraft/blob/main/AGENTS.md' },
        { label: '功能对照表', href: 'https://github.com/storytold/lightcraft/blob/main/docs/parity-checklist.md' },
        { label: '发行说明', href: 'https://github.com/storytold/lightcraft/releases' },
        { label: 'MIT 许可', href: 'https://github.com/storytold/lightcraft/blob/main/LICENSE-MIT' },
        { label: 'Apache-2.0 许可', href: 'https://github.com/storytold/lightcraft/blob/main/LICENSE-APACHE' },
      ],
    },
    {
      title: 'ArtCraft',
      links: [
        { label: 'getartcraft.com', href: 'https://getartcraft.com/' },
        { label: '全部 Crafting Apps', href: 'https://getartcraft.com/apps' },
      ],
    },
  ],
  contact: [
    { label: 'getartcraft.com', href: 'https://getartcraft.com/' },
    { label: 'github.com/storytold/lightcraft', href: 'https://github.com/storytold/lightcraft' },
  ],
  mast: '用纯 Rust 写的开源照片图库与 raw 显影工具。',
  copyright: '© 2026 ArtCraft 团队与 LightCraft 贡献者',
}
