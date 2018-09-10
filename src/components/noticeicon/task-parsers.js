/**
 * 切片任务进度转换
 * @param {any} data 任务数据
 * @param {String} taskId 任务ID
 */
export function parseCacheTask(data, taskId) {
  let mapProgress = parseFloat(data.mapProgress || 0);
  let reduceProgress = parseFloat(data.reduceProgress || 0);
  let progress = (mapProgress + reduceProgress) * 0.5;
  return {
    id: taskId,
    progress,
    successful: eval(data.isSuccessful),
    complete: eval(data.isComplete),
    message: '',
  };
}
