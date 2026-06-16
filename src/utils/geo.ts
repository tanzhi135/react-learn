// 引入 Cesium 核心工具：Cartesian3 三维坐标类，Math 提供弧度/角度转换等数学方法
import { Cartesian3, Math as CesiumMath } from 'cesium'

/** 经纬度点类型：简化经纬度对象的结构定义 */
export type LngLat = { longitude: number; latitude: number }

/**
 * 工具函数：将经纬度点数组转换为 Cesium 三维坐标数组
 * @param points - 包含 longitude/latitude 的对象数组
 * @returns Cartesian3 数组，高度统一设为 0（地表高度）
 */
export function toCartesian3Array(points: LngLat[]): Cartesian3[] {
  // 遍历每个点，调用 fromDegrees(经度, 纬度, 高度) 转为 Cesium 内部三维坐标
  return points.map(p => Cartesian3.fromDegrees(p.longitude, p.latitude, 0))
}

/**
 * 核心算法：计算球面上多边形的近似面积
 * 思路：将经纬度投影到多边形中心点的局部切平面 → 用鞋带公式计算平面面积
 * 适用于小范围多边形，大范围时需用球面三角更精确
 * @param points - 多边形顶点数组（至少 3 个点）
 * @returns 面积值，单位：平方米
 */
export function computeArea(points: LngLat[]): number {
  const n = points.length     // 顶点个数
  if (n < 3) return 0         // 少于 3 个点无法构成多边形

  const R = 6378137           // 地球赤道半径（WGS84 椭球参数），单位：米

  // 步骤 1：计算所有顶点的经纬度算术平均值，作为局部切平面的中心点
  let centerLat = 0           // 纬度累加器
  let centerLng = 0           // 经度累加器
  for (const p of points) {   // 遍历所有顶点
    centerLat += p.latitude   // 累加纬度
    centerLng += p.longitude  // 累加经度
  }
  centerLat /= n              // 平均纬度（单位：度）
  centerLng /= n              // 平均经度（单位：度）

  const centerLatRad = CesiumMath.toRadians(centerLat)  // 中心纬度转为弧度，用于 cos 计算

  // 步骤 2：将每个顶点投影到中心点处的局部切平面，得到米制坐标系下的 (x, y) 坐标
  const localPoints = points.map(p => {
    // 经度差转弧度 × cos(中心纬度)：纬度越高，同样经度差对应的实际距离越小（经线收敛效应）
    const dLng = CesiumMath.toRadians(p.longitude - centerLng) * Math.cos(centerLatRad)
    // 纬度差直接转为弧度（纬度方向距离与弧度呈线性关系）
    const dLat = CesiumMath.toRadians(p.latitude - centerLat)
    // 弧度差 × 地球半径 = 实际米制距离
    return { x: dLng * R, y: dLat * R }
  })

  // 步骤 3：鞋带公式（Shoelace Formula）计算平面多边形面积
  // 公式：S = 0.5 × |Σ(x_i × y_{i+1} - x_{i+1} × y_i)|
  let area = 0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n     // 下一个顶点索引，最后一个顶点连回第一个
    area += localPoints[i].x * localPoints[j].y   // 交叉相乘累加
    area -= localPoints[j].x * localPoints[i].y   // 交叉相乘累减
  }

  return Math.abs(area) / 2   // 取绝对值后除以 2 得到最终面积（平方米）
}

/**
 * 工具函数：将平方米格式化为可读字符串，根据数量级自动选择合适的单位
 * @param squareMeters - 平方米值
 * @returns 格式化后的字符串（如 "1.2345 km²" / "500.00 m²" / "80.00 cm²"）
 */
export function formatArea(squareMeters: number): string {
  if (squareMeters >= 1_000_000) {                              // 大于等于 1 平方公里
    return `${(squareMeters / 1_000_000).toFixed(4)} km²`      // 转平方公里，保留 4 位小数
  }
  if (squareMeters >= 1) {                                      // 1 平方米 ~ 999999 平方米
    return `${squareMeters.toFixed(2)} m²`                      // 直接显示平方米，保留 2 位小数
  }
  // 小于 1 平方米（极小面积）
  return `${(squareMeters * 10_000).toFixed(2)} cm²`            // 转平方厘米，保留 2 位小数
}