import type { KnowledgePoint } from '../types';

// 32 张知识卡。body 为受信任的静态 HTML 片段，由阅读页直接注入。
export const KP: KnowledgePoint[] = [
{id:'k1-1',stage:'s1',title:'天干十位',tag:'符号',body:`
<p>天干只有十个，是八字最底层的符号。它不是「天上的东西」，而是一套用来标记 <strong>五行 + 阴阳</strong> 的编号系统——十干两两一组，恰好把五行各分阴阳。</p>
<table><thead><tr><th>天干</th><th>五行</th><th>阴阳</th><th>方位</th><th>季节</th></tr></thead><tbody>
<tr><td>甲乙</td><td>木</td><td>甲阳 乙阴</td><td>东</td><td>春</td></tr>
<tr><td>丙丁</td><td>火</td><td>丙阳 丁阴</td><td>南</td><td>夏</td></tr>
<tr><td>戊己</td><td>土</td><td>戊阳 己阴</td><td>中</td><td>四季月</td></tr>
<tr><td>庚辛</td><td>金</td><td>庚阳 辛阴</td><td>西</td><td>秋</td></tr>
<tr><td>壬癸</td><td>水</td><td>壬阳 癸阴</td><td>北</td><td>冬</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>甲 = 阳木 = 参天大树；乙 = 阴木 = 花草藤蔓。同一个五行，阴阳不同，象就不同。</div>
<div class="note note-warn"><div class="note-k">易错</div>戊己属土，居中央，不主一方，而是寄旺于四季月（辰戌丑未）。所以土在四季都有力量，不是「没有季节」。</div>`},

{id:'k1-2',stage:'s1',title:'地支十二位',tag:'符号',body:`
<p>地支十二位比天干复杂：它同时承担<strong>月份</strong>、<strong>时辰</strong>、<strong>方位</strong>、<strong>藏干载体</strong>四重身份。八字里的「地」支，主要作用是把天干的力量落到实处。</p>
<table><thead><tr><th>地支</th><th>五行</th><th>阴阳</th><th>月令</th><th>时辰</th></tr></thead><tbody>
<tr><td>子</td><td>水</td><td>阳</td><td>十一月</td><td>23–01</td></tr>
<tr><td>丑</td><td>土</td><td>阴</td><td>十二月</td><td>01–03</td></tr>
<tr><td>寅</td><td>木</td><td>阳</td><td>正月</td><td>03–05</td></tr>
<tr><td>卯</td><td>木</td><td>阴</td><td>二月</td><td>05–07</td></tr>
<tr><td>辰</td><td>土</td><td>阳</td><td>三月</td><td>07–09</td></tr>
<tr><td>巳</td><td>火</td><td>阴</td><td>四月</td><td>09–11</td></tr>
<tr><td>午</td><td>火</td><td>阳</td><td>五月</td><td>11–13</td></tr>
<tr><td>未</td><td>土</td><td>阴</td><td>六月</td><td>13–15</td></tr>
<tr><td>申</td><td>金</td><td>阳</td><td>七月</td><td>15–17</td></tr>
<tr><td>酉</td><td>金</td><td>阴</td><td>八月</td><td>17–19</td></tr>
<tr><td>戌</td><td>土</td><td>阳</td><td>九月</td><td>19–21</td></tr>
<tr><td>亥</td><td>水</td><td>阴</td><td>十月</td><td>21–23</td></tr>
</tbody></table>
<div class="note note-warn"><div class="note-k">争议</div>地支阴阳有两套说法：一套按序位分（子阳丑阴、寅阳卯阴……，即上表），一套按藏干本气分（子藏癸为阴，故子属阴）。排盘与十神推导通行前者。初学先固定一套走通，别中途换。</div>`},

{id:'k1-3',stage:'s1',title:'地支藏干',tag:'核心',body:`
<p>地支不是「纯」的五行，每个地支内部都藏着若干天干，叫<strong>藏干</strong>。按力量分本气、中气、余气。八字里天干能不能「使上劲」，全看地支有没有对应的藏干。</p>
<table><thead><tr><th>地支</th><th>本气</th><th>中气</th><th>余气</th></tr></thead><tbody>
<tr><td>子</td><td>癸</td><td>—</td><td>—</td></tr>
<tr><td>丑</td><td>己</td><td>癸</td><td>辛</td></tr>
<tr><td>寅</td><td>甲</td><td>丙</td><td>戊</td></tr>
<tr><td>卯</td><td>乙</td><td>—</td><td>—</td></tr>
<tr><td>辰</td><td>戊</td><td>乙</td><td>癸</td></tr>
<tr><td>巳</td><td>丙</td><td>庚</td><td>戊</td></tr>
<tr><td>午</td><td>丁</td><td>己</td><td>—</td></tr>
<tr><td>未</td><td>己</td><td>丁</td><td>乙</td></tr>
<tr><td>申</td><td>庚</td><td>壬</td><td>戊</td></tr>
<tr><td>酉</td><td>辛</td><td>—</td><td>—</td></tr>
<tr><td>戌</td><td>戊</td><td>辛</td><td>丁</td></tr>
<tr><td>亥</td><td>壬</td><td>甲</td><td>—</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">规律</div>四正（子卯酉）只藏本气，午多藏一个己；四生（寅申巳亥）藏三气（亥两气）；四库（辰戌丑未）也藏三气，但以土为本。</div>
<div class="note note-warn"><div class="note-k">易错</div>巳的藏干是丙（本气）、庚（中气）、戊（余气）。有人写作「丙戊庚」，那是按生克顺序排，不影响取用，但问「本气是什么」时答案必须是丙。</div>`},

{id:'k1-4',stage:'s1',title:'五行生克',tag:'符号',body:`
<p>五行之间只有两种基本关系：<strong>生</strong>（滋养、推动）和<strong>克</strong>（制约、消耗）。所有十神、格局、旺衰的推演，本质上都是在追踪这两种关系。</p>
<ul>
<li><strong>相生</strong>：木生火 → 火生土 → 土生金 → 金生水 → 水生木</li>
<li><strong>相克</strong>：木克土 → 土克水 → 水克火 → 火克金 → 金克木</li>
</ul>
<div class="note note-ex"><div class="note-k">记忆法</div>把五行排成一个环。生，是走到相邻的下一位；克，是隔一位跳过去。</div>
<div class="note note-warn"><div class="note-k">关键认知</div>生克本身没有吉凶。生我者未必好（印多埋身，人变懒散）；克我者未必坏（七杀有制，反成权柄）。把生克直接等同于好坏，是初学者最常见的思维陷阱。</div>`},

{id:'k1-5',stage:'s1',title:'十神的生成',tag:'核心',body:`
<p>十神不是十种「神」，而是一套<strong>关系命名法</strong>。以日干为「我」，与其他天干发生五种关系，每种再按阴阳同异分成两类，就是十神。</p>
<table><thead><tr><th>关系</th><th>同性</th><th>异性</th></tr></thead><tbody>
<tr><td>同我（比和）</td><td>比肩</td><td>劫财</td></tr>
<tr><td>我生</td><td>食神</td><td>伤官</td></tr>
<tr><td>我克</td><td>偏财</td><td>正财</td></tr>
<tr><td>克我</td><td>七杀</td><td>正官</td></tr>
<tr><td>生我</td><td>偏印</td><td>正印</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>日干甲（阳木）：见丙（阳火）→ 我生 + 同性 → 食神；见丁（阴火）→ 我生 + 异性 → 伤官；见庚（阳金）→ 克我 + 同性 → 七杀；见辛（阴金）→ 克我 + 异性 → 正官。</div>
<div class="note note-warn"><div class="note-k">易错</div>最容易反的是「克我」这一组：<strong>同性为七杀，异性为正官</strong>。凭直觉容易记成「正官更凶」，实际正好相反。</div>`},

{id:'k1-6',stage:'s1',title:'十神速查表',tag:'工具',extra:'shishen',body:`
<p>下表横行为日干，纵列为所见之干，交叉处即该干的十神。建议先自己推十格，再对照检查——推比背有用得多。</p>
<div class="note note-ex"><div class="note-k">推法</div>两步走：先判五行关系（同／我生／我克／克我／生我），再判阴阳同异。熟练后两步合成一步，一秒出结果。</div>`},

{id:'k1-7',stage:'s1',title:'天干五合与相冲',tag:'关系',body:`
<p>天干之间除了生克，还有两种直接的牵制关系：<strong>合</strong>与<strong>冲</strong>。</p>
<table><thead><tr><th>天干五合</th><th>合化五行</th><th>天干相冲</th></tr></thead><tbody>
<tr><td>甲己</td><td>土</td><td>甲庚</td></tr>
<tr><td>乙庚</td><td>金</td><td>乙辛</td></tr>
<tr><td>丙辛</td><td>水</td><td>丙壬</td></tr>
<tr><td>丁壬</td><td>木</td><td>丁癸</td></tr>
<tr><td>戊癸</td><td>火</td><td>戊己无冲</td></tr>
</tbody></table>
<div class="note note-warn"><div class="note-k">关键区分</div><strong>合 ≠ 化</strong>。合是「关系」，化是「结果」。合化需要条件：月令支持、无争合妒合、所化之神有根。初学最容易把「见合」直接当「已化」，一步错到后面全错。</div>`},

{id:'k1-8',stage:'s1',title:'地支六冲 · 六合 · 六害',tag:'关系',body:`
<p>地支关系比天干复杂，因为地支同时是「位置」和「藏干容器」。同样是两支相遇，可能是撞、可能是牵、也可能是暗损。</p>
<table><thead><tr><th>六冲</th><th>六合</th><th>六害</th></tr></thead><tbody>
<tr><td>子午</td><td>子丑</td><td>子未</td></tr>
<tr><td>丑未</td><td>寅亥</td><td>丑午</td></tr>
<tr><td>寅申</td><td>卯戌</td><td>寅巳</td></tr>
<tr><td>卯酉</td><td>辰酉</td><td>卯辰</td></tr>
<tr><td>辰戌</td><td>巳申</td><td>申亥</td></tr>
<tr><td>巳亥</td><td>午未</td><td>酉戌</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">怎么记</div>六冲是「相隔六位」的正面对撞；六合是「相隔一位」的暗中牵引；六害是「合我被冲」的产物——本来是合伴，被冲走了，剩下的怨气就是害。</div>
<div class="note note-warn"><div class="note-k">易错</div>合与冲可以同时存在。比如子水，既与丑合，又与午冲——它同时被拉、被撞。此时要看位置远近与力量大小，不能一句「合解冲」了事。</div>`},

{id:'k1-9',stage:'s1',title:'三合 · 三会 · 三刑',tag:'关系',body:`
<p>三支以上成组，力量远大于两两关系。这是判断「局」的关键——单个字只是符号，成局才是力量。</p>
<table><thead><tr><th>类型</th><th>组合</th><th>备注</th></tr></thead><tbody>
<tr><td>三合局</td><td>申子辰（水）· 亥卯未（木）· 寅午戌（火）· 巳酉丑（金）</td><td>缺一为半合，力量减等</td></tr>
<tr><td>三会方</td><td>寅卯辰（木）· 巳午未（火）· 申酉戌（金）· 亥子丑（水）</td><td>力量大于三合，条件更严</td></tr>
<tr><td>三刑</td><td>寅巳申（无恩）· 丑戌未（恃势）· 子卯（无礼）· 辰午酉亥（自刑）</td><td>刑主纠结、反复、内耗</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">半合</div>三合局里，中间那个叫「旺地」（子午卯酉），两边叫「生地」和「墓地」。生地 + 旺地 或 旺地 + 墓地 可成半合；生地 + 墓地 不成局。</div>
<div class="note note-warn"><div class="note-k">易错</div>三刑不等于凶。刑是「结构上的纠缠」，落在人事上常表现为反复、拖延、内耗，但若刑动的是喜神，也可能是「折腾出机会」。</div>`},

{id:'k2-1',stage:'s2',title:'年柱以立春为界',tag:'排盘',body:`
<p>八字的年柱既不是元旦，也不是春节（农历正月初一），而是以 <strong>立春</strong> 为界。立春时刻之前出生，年柱取上一年干支；之后取本年。</p>
<div class="note note-ex"><div class="note-k">例</div>某人公历 2 月 3 日出生，当年立春在 2 月 4 日 16 时 → 年柱仍属上一年。哪怕农历已经是新的一年，年柱也不变。</div>
<div class="note note-warn"><div class="note-k">第一大坑</div>很多人拿农历生日直接换算，结果年柱错一位，由此推出的十神、大运方向全错。年柱一错，整盘皆废——这是排盘里后果最严重的错误。</div>`},

{id:'k2-2',stage:'s2',title:'月柱以节气为界',tag:'排盘',body:`
<p>月柱的地支由「节」决定，不是农历月份。十二节依次对应十二月支：</p>
<table><thead><tr><th>节</th><th>月支</th><th>节</th><th>月支</th></tr></thead><tbody>
<tr><td>立春</td><td>寅</td><td>立秋</td><td>申</td></tr>
<tr><td>惊蛰</td><td>卯</td><td>白露</td><td>酉</td></tr>
<tr><td>清明</td><td>辰</td><td>寒露</td><td>戌</td></tr>
<tr><td>立夏</td><td>巳</td><td>立冬</td><td>亥</td></tr>
<tr><td>芒种</td><td>午</td><td>大雪</td><td>子</td></tr>
<tr><td>小暑</td><td>未</td><td>小寒</td><td>丑</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>农历正月初一若在立春之前，那么初一到立春这几天，月支仍是上一年的丑，不是寅。</div>
<div class="note note-warn"><div class="note-k">节 ≠ 气</div>二十四节气里，立春、惊蛰、清明这类叫「节」；雨水、春分、谷雨这类叫「气」。<strong>定月只看节，不看气。</strong>搞混这一条，月柱会错半个月。</div>`},

{id:'k2-3',stage:'s2',title:'五虎遁：年上起月',tag:'排盘',body:`
<p>已知年干，推每月天干，用「五虎遁」。口诀：<strong>甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸之年何处觅，甲寅之上好追求。</strong></p>
<table><thead><tr><th>年干</th><th>寅月天干</th><th>年干</th><th>寅月天干</th></tr></thead><tbody>
<tr><td>甲、己</td><td>丙</td><td>丁、壬</td><td>壬</td></tr>
<tr><td>乙、庚</td><td>戊</td><td>戊、癸</td><td>甲</td></tr>
<tr><td>丙、辛</td><td>庚</td><td></td><td></td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>年干为丙 → 寅月天干为庚 → 庚寅、辛卯、壬辰、癸巳……顺推下去即可。</div>
<div class="note note-warn"><div class="note-k">注意</div>五虎遁只推<strong>月干</strong>，月支是固定的（从寅起）。别把它当成推月支的口诀用。</div>`},

{id:'k2-4',stage:'s2',title:'五鼠遁：日上起时',tag:'排盘',body:`
<p>已知日干，推十二时辰的天干，用「五鼠遁」。口诀：<strong>甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途。</strong></p>
<table><thead><tr><th>日干</th><th>子时天干</th><th>日干</th><th>子时天干</th></tr></thead><tbody>
<tr><td>甲、己</td><td>甲</td><td>丁、壬</td><td>庚</td></tr>
<tr><td>乙、庚</td><td>丙</td><td>戊、癸</td><td>壬</td></tr>
<tr><td>丙、辛</td><td>戊</td><td></td><td></td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>日干为丁 → 子时天干为庚 → 庚子、辛丑、壬寅、癸卯……</div>
<div class="note note-warn"><div class="note-k">注意</div>时支固定从子起，一天十二个时辰。23:00 起算子时，跨日问题见下一张卡。</div>`},

{id:'k2-5',stage:'s2',title:'日柱与子时换日',tag:'排盘',body:`
<p>日柱在八字里最特殊：它不按年、不按月，而是<strong>连续纪日</strong>，六十天一循环。所以日柱必须查万年历或用公式，不能靠年、月「推」出来。</p>
<p>麻烦出在子时（23:00–01:00）跨了两天。于是产生两派：</p>
<ul>
<li><strong>早子时派</strong>：23:00 之后即算次日，日柱换、时柱用次日子时。</li>
<li><strong>夜子时派</strong>：23:00–24:00 仍属当日，日柱不换，只是时柱借用次日的子时干。</li>
</ul>
<div class="note note-warn"><div class="note-k">怎么办</div>两派都有实践者，结论会有差异。学习阶段先固定一派（建议早子时，主流软件多用），但必须<strong>知道自己选了哪一派</strong>，不要在不同命例之间混着用——混用会让你永远无法复盘。</div>`},

{id:'k2-6',stage:'s2',title:'真太阳时校正',tag:'排盘',body:`
<p>北京时间是东经 120° 的区时。出生地不在 120° 经线上，当地真实太阳时与钟表时间就有差：<strong>每偏离 1 个经度，差 4 分钟</strong>。此外还有「均时差」（地球轨道椭圆造成，全年在 ±16 分钟内波动）。</p>
<div class="note note-ex"><div class="note-k">例</div>乌鲁木齐约东经 87°，比 120° 偏西 33° → 晚 132 分钟。当地钟表 12:00，真太阳时约 9:48。午时（11–13）可能因此变成巳时（9–11），时柱整个换掉。</div>
<div class="note note-warn"><div class="note-k">什么时候必须校</div>只有出生时间接近<strong>时辰交界</strong>（整点前后半小时内）时，校正才可能改变时柱。不是所有人都必须校，但交界处必须查——这是「知道什么时候该较真」的判断力。</div>`},

{id:'k3-1',stage:'s3',title:'月令取格',tag:'结构',body:`
<p>格局法第一步：看<strong>月令</strong>（月支）。月支所藏之干透出天干，即以该十神为格；本气不透看中气、余气；都不透则取月支本气论格。</p>
<p>八格：正官、七杀、正财、偏财、食神、伤官、正印、偏印。另有建禄格（月支为日干之禄）、月劫格（月支为日干之刃）。</p>
<div class="note note-ex"><div class="note-k">例</div>月支为寅（藏甲丙戊）。天干透甲（比肩）→ 建禄格；透丙（食神）→ 食神格；透戊（偏财）→ 偏财格。透两个怎么办？看哪个更有力、更得月令之气。</div>
<div class="note note-warn"><div class="note-k">易错</div>取格不是「看到什么就取什么」。月令是纲，其他位置透出的十神是辅。主次颠倒，格局就散了。</div>`},

{id:'k3-2',stage:'s3',title:'格局的成败与救应',tag:'结构',body:`
<p>格取出来只是开始。真正决定结构质量的是<strong>成败</strong>：成格有成格的条件，破格有破格的原因，破而有救则仍可用。</p>
<p>以正官格为例：官星需财生（有源头）、需印护（不受伤害）；怕伤官克、怕刑冲破害。若官格见伤官，看似破格——但若同时有印，印能制伤护官，反成「伤官配印」的贵格。</p>
<div class="note note-ex"><div class="note-k">例</div>正官格 + 天干透伤官 + 天干透印 → 破中有救。判断要点不是「有没有伤官」，而是「伤官有没有被制住」。</div>
<div class="note note-warn"><div class="note-k">别过度解读</div>「破格」不等于「命不好」。破格只是说这个结构不成，落到具体人事还要看大运是否补足、所破的是哪一部分。</div>`},

{id:'k3-3',stage:'s3',title:'顺用与逆用',tag:'结构',body:`
<p>四吉神（财、官、印、食）宜<strong>顺用</strong>——生之护之，不宜克伐；四凶神（杀、伤、枭、刃）宜<strong>逆用</strong>——制之化之，反成其用。</p>
<table><thead><tr><th>神</th><th>用法</th><th>典型组合</th></tr></thead><tbody>
<tr><td>正官</td><td>顺用：财生印护</td><td>官印相生</td></tr>
<tr><td>七杀</td><td>逆用：制或化</td><td>食神制杀、印化杀</td></tr>
<tr><td>伤官</td><td>逆用：制或泄</td><td>伤官配印、伤官生财</td></tr>
<tr><td>正财</td><td>顺用：食伤生财</td><td>食神生财</td></tr>
</tbody></table>
<div class="note note-warn"><div class="note-k">关键认知</div>「吉神 / 凶神」是结构术语，不是道德评价。七杀逆用得宜，往往比正官更有力量——这正是「制杀为权」的意思。</div>`},

{id:'k3-4',stage:'s3',title:'旺衰三要素',tag:'核心',body:`
<p>判断日主强弱，看三件事：<strong>得令</strong>（月令是否生扶）、<strong>得地</strong>（地支是否有根）、<strong>得势</strong>（天干党众多少）。三者之中，得令权重最大。</p>
<p>旺相休囚死，是判断得令的具体标准：</p>
<table><thead><tr><th>日干与月令的关系</th><th>状态</th></tr></thead><tbody>
<tr><td>日干五行 = 月令五行</td><td>旺</td></tr>
<tr><td>月令生日干</td><td>相</td></tr>
<tr><td>日干生月令</td><td>休</td></tr>
<tr><td>月令克日干</td><td>囚</td></tr>
<tr><td>日干克月令</td><td>死</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>日干甲木生于寅月 → 同为木 → 旺。生于子月 → 水生木 → 相。生于午月 → 木生火 → 休。生于申月 → 金克木 → 囚。生于辰月 → 木克土 → 死。</div>
<div class="note note-warn"><div class="note-k">易错</div>得令不等于身强。月令当令但地支无根、天干无帮，仍可能偏弱；反过来，失令但根重党多，也可能偏强。</div>`},

{id:'k3-5',stage:'s3',title:'通根与透干',tag:'结构',body:`
<p><strong>通根</strong>：天干在地支藏干中找到同类五行，即为有根。根有轻重：本气根 &gt; 中气根 &gt; 余气根。</p>
<p><strong>透干</strong>：地支藏干在天干出现，叫透出。透出则力量显化，可以正式参与格局判断；不透则只是「暗藏的力量」，作用有限。</p>
<div class="note note-ex"><div class="note-k">例</div>日干甲木：地支见寅（藏甲丙戊）→ 甲在寅为本气根，根重；见卯（藏乙）→ 乙为同类，根重；见辰（藏戊乙癸）→ 只有乙是余气根，根轻。</div>
<div class="note note-warn"><div class="note-k">易错</div>「有根」和「根重」是两件事。判断强弱要看根的数量、位置、是本气还是余气，不能只数「有没有」。</div>`},

{id:'k3-6',stage:'s3',title:'调候：寒暖燥湿',tag:'核心',body:`
<p>调候是第三把尺，看的是<strong>寒暖燥湿</strong>，与旺衰、格局互相独立。它回答的问题不是「日主够不够强」，而是「这个盘能不能正常运转」。</p>
<table><thead><tr><th>情形</th><th>所需</th></tr></thead><tbody>
<tr><td>冬月（亥子丑）生，局寒</td><td>需火暖局</td></tr>
<tr><td>夏月（巳午未）生，局燥</td><td>需水润局</td></tr>
<tr><td>土燥（戌未多）</td><td>需水</td></tr>
<tr><td>土湿（辰丑多）</td><td>需火</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>子月生的甲木，纵使身强，若全局无火，仍是「寒木不发」——调候上以丙火为要。这时候旺衰说「身强该用财官」，调候说「先要火」，两者就冲突了。</div>
<div class="note note-warn"><div class="note-k">冲突是常态</div>调候与旺衰经常打架。这正是第三阶真正要处理的问题，也是「为什么背会三套方法不等于会断命」的原因。</div>`},

{id:'k3-7',stage:'s3',title:'三法冲突时怎么采信',tag:'方法论',body:`
<p>三套方法各有<strong>前提假设</strong>：格局法假设「月令为纲、结构可辨」；旺衰法假设「日主有强弱、用忌可分」；调候法假设「寒暖影响生机」。前提不成立时，方法就失效。</p>
<p>建议的采信顺序：</p>
<ol>
<li>先看是否属特殊结构（从格、专旺、化气）。若是，旺衰法的常规判断直接失效，不要硬套。</li>
<li>再看调候是否极端（冬生无火、夏生无水）。极端情况下，调候优先于旺衰。</li>
<li>常规盘：以格局为主干，用旺衰校验日主能否承受，用调候作最后修正。</li>
</ol>
<div class="note note-warn"><div class="note-k">不要投票</div>三法不是三个平等的评委，不能「两票对一票」。它们是有优先级的判断流程。把三法当投票，结果一定是骑墙。</div>`},

{id:'k3-8',stage:'s3',title:'从格与专旺',tag:'结构',body:`
<p>当日主极弱、全局一边倒（财官食伤成势），可能出现<strong>从格</strong>：弃命从之，反以所从之神为用。日主极强、比劫成方局，则可能<strong>专旺</strong>。</p>
<p>判断关键只有一条：<strong>日主有没有根、有没有印比生扶</strong>。真从格不能见印比，见之则破。</p>
<div class="note note-warn"><div class="note-k">最容易滥用</div>从格是初学者最爱用的「万能解释」——断不准就说「这是从格」。真从格条件很严，绝大多数盘都不是。用它之前，先证明日主确实无根无援。</div>`},

{id:'k4-1',stage:'s4',title:'十神心性',tag:'象法',body:`
<p>十神落到人事，最直接的用法是看性格倾向。这是「倾向」不是「性格鉴定」——同一个十神在不同格局、不同位置，表现差别很大。</p>
<table><thead><tr><th>十神</th><th>常见倾向</th></tr></thead><tbody>
<tr><td>比肩</td><td>自主、竞争、固执</td></tr>
<tr><td>劫财</td><td>冲动、合群、易破财</td></tr>
<tr><td>食神</td><td>温和、才艺、重享受</td></tr>
<tr><td>伤官</td><td>才华、表达欲强、不受约束</td></tr>
<tr><td>正财</td><td>务实、节俭、求稳定</td></tr>
<tr><td>偏财</td><td>慷慨、善社交、偏投机</td></tr>
<tr><td>正官</td><td>守规、有责任感、重名誉</td></tr>
<tr><td>七杀</td><td>有魄力、承压力、敢冒险</td></tr>
<tr><td>正印</td><td>好学、包容、偏保守</td></tr>
<tr><td>偏印</td><td>直觉强、专精、偏孤僻</td></tr>
</tbody></table>
<div class="note note-warn"><div class="note-k">别贴标签</div>「伤官见官」不等于「这人一定顶撞上司」。十神给的是行为倾向，具体表现还要看年龄、环境、大运。</div>`},

{id:'k4-2',stage:'s4',title:'宫位：年月日时',tag:'象法',body:`
<p>宫位提供「位置信息」，十神提供「关系信息」，两者必须合看——只看十神不看宫位，断不出具体的人事。</p>
<table><thead><tr><th>宫位</th><th>所主</th><th>年龄段</th></tr></thead><tbody>
<tr><td>年柱</td><td>祖上、父母根基、少年环境</td><td>1–16</td></tr>
<tr><td>月柱</td><td>父母、兄弟、青年环境</td><td>17–32</td></tr>
<tr><td>日柱</td><td>日干为自身，日支为配偶宫</td><td>33–48</td></tr>
<tr><td>时柱</td><td>子女、晚年、下属</td><td>49 以后</td></tr>
</tbody></table>
<div class="note note-ex"><div class="note-k">例</div>日支为配偶宫，日支逢冲，常主婚姻关系多变动——但要看冲的是喜神还是忌神。冲忌神，反而是「冲开困局」。</div>`},

{id:'k4-3',stage:'s4',title:'大运的排法',tag:'运程',body:`
<p>大运从月柱起，顺排或逆排，取决于<strong>年干阴阳 + 性别</strong>：</p>
<table><thead><tr><th>年干</th><th>男命</th><th>女命</th></tr></thead><tbody>
<tr><td>阳年（甲丙戊庚壬）</td><td>顺排</td><td>逆排</td></tr>
<tr><td>阴年（乙丁己辛癸）</td><td>逆排</td><td>顺排</td></tr>
</tbody></table>
<p>顺排 = 月柱后一位起（月柱丙寅 → 丁卯、戊辰、己巳……）；逆排 = 月柱前一位起（丙寅 → 乙丑、甲子、癸亥……）。</p>
<div class="note note-ex"><div class="note-k">例</div>年干丙（阳），男命 → 顺排。月柱丙寅 → 第一步大运丁卯，第二步戊辰。</div>
<div class="note note-warn"><div class="note-k">后果</div>方向搞反，整条大运全错，而且错得毫无察觉——这是比排错日柱更隐蔽的错误。起运岁数按出生到下一个（顺）或上一个（逆）节气的天数折算，三天折一年。</div>`},

{id:'k4-4',stage:'s4',title:'流年的触发条件',tag:'运程',body:`
<p>流年本身只是一个干支。它要「触发」原局或大运里<strong>已经存在的结构</strong>，才会应事。没有结构，流年再凶也只是「路过」。</p>
<table><thead><tr><th>触发类型</th><th>含义</th></tr></thead><tbody>
<tr><td>岁运并临</td><td>流年与大运干支完全相同</td></tr>
<tr><td>天克地冲</td><td>天干相克、地支相冲同时发生</td></tr>
<tr><td>伏吟</td><td>干支重复出现，主停滞、反复</td></tr>
<tr><td>反吟</td><td>天克地冲的对称形式，主剧变</td></tr>
<tr><td>合动 / 冲动</td><td>把原局某个字牵出来或撞出来</td></tr>
</tbody></table>
<div class="note note-warn"><div class="note-k">关键</div>触发只说明「这一年结构被搅动」，不说明吉凶。是吉是凶，取决于被搅动的是喜神还是忌神。很多人一看到「天克地冲」就断凶，这是把手段当结论。</div>`},

{id:'k4-5',stage:'s4',title:'应期与可证伪表述',tag:'方法论',body:`
<p>应期的本质是「结构 + 触发 + 时间」三者对齐。同一结构可能被多次触发，所以同类事件会反复出现，只是程度不同。</p>
<p>写判断时必须写成可证伪形式：</p>
<div class="note note-ex"><div class="note-k">模板</div>「若 X 年发生 A，则此判断成立；若发生 B，则说明我在第几步推错了。」</div>
<div class="note note-warn"><div class="note-k">反面教材</div>「今年有变动」「注意健康」「事业有起伏」——这类话永远显得准，因为无法被证伪。写这种断语，练十年也只是练口才。</div>`},

{id:'k5-1',stage:'s5',title:'命例卡的写法',tag:'方法',body:`
<p>每断一例，都按固定模板记录，不即兴发挥。模板的价值是<strong>强迫你把推理链写完整</strong>，而不是只留一个结论。</p>
<ul>
<li>四柱（注明是否已校真太阳时）</li>
<li>大运（起运岁数、现行大运）</li>
<li>取格 · 旺衰 · 调候 三项分别写</li>
<li><strong>三法是否一致，冲突在哪</strong></li>
<li><strong>本次采信哪一套，理由是什么</strong>（必填）</li>
<li>判断 3–5 条，含年份、含置信度</li>
<li>证伪条件</li>
<li>实际结果（留空，事后填）</li>
<li>复盘：错在排盘／结构／取用／应期哪一步</li>
</ul>
<div class="note note-warn"><div class="note-k">关键</div>「采信理由」这一栏必须填。空着这一栏，你练的只是记忆，不是判断。</div>`},

{id:'k5-2',stage:'s5',title:'错例本优先于对例本',tag:'方法',body:`
<p>对例让人自我确认，<strong>错例才提供信息</strong>。每一条错判都要定位到具体断点，而不是笼统记一句「我错了」。</p>
<div class="note note-ex"><div class="note-k">例</div>断某人 2020 年升职，实际是跳槽。复盘：结构判断没错（官星被引动），错在把「引动」直接等同于「升迁」，忽略了同时存在的驿马与财星动向。→ 断点：<strong>象的翻译</strong>，不是结构。</div>
<div class="note note-warn"><div class="note-k">价值</div>十条对例给你的信息，可能不如一条定位准确的错例。因为对例可能只是运气，错例一定暴露了方法漏洞。</div>`},

{id:'k5-3',stage:'s5',title:'反推验证',tag:'方法',body:`
<p>从已知事实反推盘面特征，再正推回去看是否自洽——这是检验方法是否可靠最有效的手段。</p>
<p>具体做法：拿到一个已知结果的命例，<strong>先不看四柱</strong>，从事实出发写下「这个盘应该有什么特征」，再打开盘面对照。</p>
<div class="note note-warn"><div class="note-k">陷阱</div>反推极易事后附会——因为你知道答案，总能找到「符合」的解释。所以必须<strong>先写下预期，再看盘</strong>，顺序颠倒就失去意义。</div>`},

{id:'k5-4',stage:'s5',title:'建立自己的判断流程',tag:'方法',body:`
<p>学到后期，你需要一套固定的、可重复执行的流程：</p>
<ol>
<li>排盘（校真太阳时、定子时派别）</li>
<li>定结构（取格、判旺衰、看调候）</li>
<li>取用（说明采信理由）</li>
<li>断象（十神 + 宫位落到具体人事）</li>
<li>定应期（找触发条件）</li>
<li>写证伪条件</li>
</ol>
<p>流程固定之后，同一个盘反复判断结果才会稳定；结果稳定，才能定位「我在哪类盘上系统性失准」。</p>
<div class="note note-warn"><div class="note-k">后果</div>没有固定流程的人，每次断命都在即兴创作，经验无法积累，十年后和第一年没区别。</div>`}
];
