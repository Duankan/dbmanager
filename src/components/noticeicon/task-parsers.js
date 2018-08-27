/**
 * 切片任务进度转换
 * @param {any} data 任务数据
 * @param {String} taskId 任务ID
 */
export function parseCacheTask(data, taskId) {
  let progress = data.mapProgress * 0.5 + data.reduceProgress * 0.5;
  return {
    id: taskId,
    progress,
    successful: eval(data.isSuccessful),
    complete: eval(data.isComplete),
    message: '',
  };
}
