import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/componentss/ui/table';
import { CircleX, DeleteIcon, Trash2 } from 'lucide-react';
import { useSidebar } from '@/componentss/ui/sidebar';
const TableCard = ({ data, isDelete, removeChart }) => {
  const isLaptop = window.innerWidth >= 1024 && window.innerWidth <= 1440;
  const { open } = useSidebar();
  return (
    <div
      className={`flex w-full ${isLaptop && open && isDelete ? 'min-w-[69.5rem] max-w-[69.5rem]' : isLaptop && open ? 'min-w-[71.5rem] max-w-[71.5rem]' : isLaptop && !open ? 'min-w-[85rem] max-w-[85rem]' : 'min-w-[76rem] max-w-[76rem]'} flex-wrap gap-3 overflow-auto pb-16 pt-2`}
    >
      {data?.items?.length > 0
        ? data.items
            .filter((item) => item.type === 'table' && item.result != null)
            .map((item, index) => (
              <div
                key={index}
                className="flex-1"
                style={{
                  minWidth: 'calc(50% - 10px)',
                  position: 'relative'
                }}
              >
                <div
                  className="border bg-white"
                  style={{
                    borderRadius: '10px',
                    position: 'relative'
                  }}
                >
                  {isDelete && (
                    <div className="absolute right-2 top-2">
                      <div className="rounded-md bg-background p-1 text-destructive hover:bg-destructive hover:text-white">
                        <CircleX
                          size={18}
                          className="cursor-pointer"
                          onClick={() =>
                            removeChart(
                              item.dashboardItemInfoId,
                              item.type,
                              index
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-bottom w-full px-4 py-4 text-xl font-bold text-black">
                    {`${
                      (typeof item?.options === 'string'
                        ? JSON.parse(item?.options)?.[0]?.cardname
                        : item?.options)?.[0]?.cardname ||
                      item?.formDisplayName ||
                      'Dashboard Item ID: ' + item.id
                    }`}
                  </div>

                  {item && item.result && Array.isArray(item.result) && (
                    <div className="cursor-pointer overflow-auto p-4">
                      <Table>
                        <div className="overflow-hidden rounded-lg">
                          <TableHeader className="w-full">
                            <TableRow className="border-none">
                              <TableHead className="bg-chart-3/30 px-8 py-3 font-semibold text-white">
                                Sr.No
                              </TableHead>
                              {item.result[0] &&
                                Object.keys(item.result[0])
                                  .filter(
                                    (key) =>
                                      ![
                                        'uuid',
                                        'created_at',
                                        'updated_at',
                                        'created_by',
                                        'updated_by'
                                      ].includes(key)
                                  )
                                  .map((key) => (
                                    <TableHead
                                      key={key}
                                      className="bg-chart-3/30 px-8 py-3 font-semibold text-white"
                                    >
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                    </TableHead>
                                  ))}
                            </TableRow>
                          </TableHeader>
                        </div>
                        <TableBody>
                          {item.result.map((resultItem, resultIndex) => (
                            <TableRow key={resultIndex}>
                              <TableCell className="px-8 py-6">
                                {resultIndex + 1}
                              </TableCell>
                              {resultItem &&
                                Object.entries(resultItem)
                                  .filter(
                                    ([key]) =>
                                      ![
                                        'uuid',
                                        'created_at',
                                        'updated_at',
                                        'created_by',
                                        'updated_by'
                                      ].includes(key)
                                  )
                                  .map(([key, value]) => (
                                    <TableCell key={key} className="px-8 py-6">
                                      {value !== null && value !== undefined
                                        ? value
                                        : 'N/A'}
                                    </TableCell>
                                  ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            ))
        : null}
      {data?.length > 0
        ? data
            .filter((item) => item.type === 'table' && item.result != null)
            .map((item, index) => (
              <div
                key={index}
                className="w-full flex-1"
                style={{
                  minWidth: 'calc(50% - 10px)',
                  position: 'relative'
                }}
              >
                <div
                  className="border bg-white"
                  style={{
                    borderRadius: '10px',
                    position: 'relative'
                  }}
                >
                  {isDelete && (
                    <div className="absolute right-2 top-2">
                      <div className="rounded-md bg-background p-1 text-destructive hover:bg-destructive hover:text-white">
                        <CircleX
                          size={18}
                          className="cursor-pointer"
                          onClick={() =>
                            removeChart(
                              item.dashboardItemInfoId,
                              item.type,
                              index
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-bottom w-full px-4 py-4 text-xl font-bold text-secondary">
                    {`${
                      (typeof item?.options === 'string'
                        ? JSON.parse(item?.options)?.[0]?.cardname
                        : item?.options)?.[0]?.cardname ||
                      item?.formDisplayName ||
                      'Dashboard Item ID: ' + item.id
                    }`}
                  </div>

                  {item && item.result && Array.isArray(item.result) && (
                    <div className="cursor-pointer overflow-auto p-4">
                      <Table>
                        <div className="overflow-hidden rounded-lg">
                          <TableHeader className="w-full">
                            <TableRow className="border-none">
                              <TableHead className="bg-chart-4 px-8 py-3 font-semibold text-white">
                                Sr.No
                              </TableHead>
                              {item.result[0] &&
                                Object.keys(item.result[0])
                                  .filter(
                                    (key) =>
                                      ![
                                        'uuid',
                                        'created_at',
                                        'updated_at',
                                        'created_by',
                                        'updated_by'
                                      ].includes(key)
                                  )
                                  .map((key) => (
                                    <TableHead
                                      key={key}
                                      className="bg-chart-4 px-8 py-3 font-semibold text-white"
                                    >
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                    </TableHead>
                                  ))}
                            </TableRow>
                          </TableHeader>
                        </div>
                        <TableBody>
                          {item.result.map((resultItem, resultIndex) => (
                            <TableRow key={resultIndex}>
                              <TableCell className="px-8 py-6">
                                {resultIndex + 1}
                              </TableCell>
                              {resultItem &&
                                Object.entries(resultItem)
                                  .filter(
                                    ([key]) =>
                                      ![
                                        'uuid',
                                        'created_at',
                                        'updated_at',
                                        'created_by',
                                        'updated_by'
                                      ].includes(key)
                                  )
                                  .map(([key, value]) => (
                                    <TableCell key={key} className="px-8 py-6">
                                      {value !== null && value !== undefined
                                        ? value
                                        : 'N/A'}
                                    </TableCell>
                                  ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            ))
        : null}
    </div>
  );
};
export default TableCard;
