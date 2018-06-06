const commonParams = [
  'the_geom',
  'geom',
  'gid',
  'ID',
  'geometry',
  'x1',
  'x2',
  'y1',
  'y2',
  'Shape_Leng',
  'Shape_Area',
  'bbox',
];

export function getColums(totalParams) {
  let fieldList = [];
  totalParams.forEach(item => {
    if (commonParams.filter(key => key === item.name).length === 0) {
      fieldList.push({
        title: item.name,
        key: item.name,
        align: 'center',
      });
    }
  });
  return fieldList;
}
