// 基础表：干支、五行、藏干、刑冲合害、遁法。全部为静态查表数据。
export const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
export const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
export const GAN_WX: Record<string, string> = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
export const GAN_YY: Record<string, string> = {甲:'阳',乙:'阴',丙:'阳',丁:'阴',戊:'阳',己:'阴',庚:'阳',辛:'阴',壬:'阳',癸:'阴'};
export const ZHI_WX: Record<string, string> = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
export const ZHI_YY: Record<string, string> = {子:'阳',丑:'阴',寅:'阳',卯:'阴',辰:'阳',巳:'阴',午:'阳',未:'阴',申:'阳',酉:'阴',戌:'阳',亥:'阴'};
export const WX = ['木','火','土','金','水'];
export const SHENG: Record<string, string> = {木:'火',火:'土',土:'金',金:'水',水:'木'};
export const KE: Record<string, string> = {木:'土',土:'水',水:'火',火:'金',金:'木'};
export const SHISHEN = ['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印'];
export const CANG: Record<string, string[]> = {
  子:['癸'], 丑:['己','癸','辛'], 寅:['甲','丙','戊'], 卯:['乙'],
  辰:['戊','乙','癸'], 巳:['丙','庚','戊'], 午:['丁','己'],
  未:['己','丁','乙'], 申:['庚','壬','戊'], 酉:['辛'],
  戌:['戊','辛','丁'], 亥:['壬','甲']
};
export const CHONG: Record<string, string> = {子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
export const LIUHE: Record<string, string> = {子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
/** 六合化气，键为按 ZHI 顺序排好的两支 */
export const LIUHE_WX: Record<string, string> = {子丑:'土',寅亥:'木',卯戌:'火',辰酉:'金',巳申:'水',午未:'土'};
export const LIUHAI: Record<string, string> = {子:'未',未:'子',丑:'午',午:'丑',寅:'巳',巳:'寅',卯:'辰',辰:'卯',申:'亥',亥:'申',酉:'戌',戌:'酉'};
export const SANHE: string[][] = [['申','子','辰','水'],['亥','卯','未','木'],['寅','午','戌','火'],['巳','酉','丑','金']];
export const SANHUI: string[][] = [['寅','卯','辰','木'],['巳','午','未','火'],['申','酉','戌','金'],['亥','子','丑','水']];
export const SANXING: string[] = ['寅巳申','丑戌未','子卯','辰午酉亥'];
export const GANHE: Record<string, string> = {甲:'己',己:'甲',乙:'庚',庚:'乙',丙:'辛',辛:'丙',丁:'壬',壬:'丁',戊:'癸',癸:'戊'};
export const GANCHONG: Record<string, string> = {甲:'庚',庚:'甲',乙:'辛',辛:'乙',丙:'壬',壬:'丙',丁:'癸',癸:'丁'};
export const GANHE_WX: Record<string, string> = {甲:'土',己:'土',乙:'金',庚:'金',丙:'水',辛:'水',丁:'木',壬:'木',戊:'火',癸:'火'};
export const WUHU: Record<string, string> = {甲:'丙',己:'丙',乙:'戊',庚:'戊',丙:'庚',辛:'庚',丁:'壬',壬:'壬',戊:'甲',癸:'甲'};
export const WUSHU: Record<string, string> = {甲:'甲',己:'甲',乙:'丙',庚:'丙',丙:'戊',辛:'戊',丁:'庚',壬:'庚',戊:'壬',癸:'壬'};
export const JIAZI: string[] = (() => { const a: string[] = []; for (let i = 0; i < 60; i++) a.push(GAN[i % 10] + ZHI[i % 12]); return a; })();

/** 十二支对应的时辰区间 */
export const ZHI_HOUR: Record<string, string> = {
  子:'23–01', 丑:'01–03', 寅:'03–05', 卯:'05–07', 辰:'07–09', 巳:'09–11',
  午:'11–13', 未:'13–15', 申:'15–17', 酉:'17–19', 戌:'19–21', 亥:'21–23',
};

/** 十二支对应的农历月令 */
export const ZHI_MONTH: Record<string, string> = {
  子:'十一月', 丑:'十二月', 寅:'正月', 卯:'二月', 辰:'三月', 巳:'四月',
  午:'五月', 未:'六月', 申:'七月', 酉:'八月', 戌:'九月', 亥:'十月',
};
