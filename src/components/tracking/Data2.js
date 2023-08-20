const data = [
  {
    id: '0',
    address: 'Root',
    mark: 'Safe',
    parentIds: ['1', '2', '3'],
  },
  {
    id: '1',
    address: 'Node',
    mark: 'Caution',
    parentIds: [],
  },
  {
    id: '2',
    address: 'Node',
    mark: 'Safe',
    parentIds: [],
  },
  {
    id: '3',
    address: 'Node',
    mark: 'Warning',
    parentIds: [],
  },
  {
    id: '4',
    address: 'Node',
    mark: 'Danger',
    parentIds: ['0'],
  },
  {
    id: '5',
    address: 'Node',
    mark: 'Warning',
    parentIds: ['0'],
  },
  {
    id: '6',
    address: 'Node',
    mark: 'Caution',
    parentIds: ['0'],
  },
]

export default data
