import { Dropdown } from '@/componentss/ui/dropdown';
import { Input } from '@/componentss/ui/input';
import { MultiSelect } from '@/componentss/ui/multi-select';
import { Stack } from '@mui/material';
const FormConfiguration = ({
  chartObj,
  handleChange,
  compiledForms,
  type,
  charts,
  range,
  fields
}) => {
  const fieldsWithOptions = fields
    ?.filter((fld) => fld?.options && fld?.options?.length > 0)
    ?.map((fld) => ({
      value: fld?.fieldInfoId,
      label: fld?.label
    }));

  const fieldOptions = fields
    ?.filter((f) => f.category !== 'TableReference')
    .map((fld) => ({
      value: fld.fieldInfoId,
      label: fld.label
    }));

  return (
    <div className="modal_container">
      <div
        className="flex flex-col gap-3 pb-2"
        style={{
          marginBottom: '15px'
        }}
      >
        <Input
          label="Name"
          required
          fullWidth
          type="text"
          placeholder="Name"
          onChange={(e) => handleChange('name', e.target.value)}
          value={chartObj?.name}
        />

        <Dropdown
          label="Select Form"
          value={chartObj.formInfoId}
          required
          placeholder="Select a form"
          onChange={(e) => handleChange('formInfoId', e.target.value)}
          options={
            compiledForms?.map((ele) => ({
              label: ele.displayName,
              value: ele.formInfoId
            })) || []
          }
        />

        <Dropdown
          label="Type"
          value={chartObj.type || ''}
          required
          placeholder="Select type"
          onChange={(e) => handleChange('type', e.target.value)}
          options={type || []}
        />
      </div>

      {chartObj &&
        chartObj.type === 'chart' &&
        Array.isArray(chartObj.options) &&
        chartObj.options.map((optObj) => (
          <div
            key={optObj.id}
            className="flex gap-2 pb-2"
            style={{
              width: '100%',
              // borderBottom: chartObj.type && '1px solid grey',
              marginBottom: '15px'
            }}
          >
            <Dropdown
              label="Chart Type"
              name="defaultChartType"
              value={optObj.defaultChartType || ''}
              required
              onChange={(e) =>
                handleChange('defaultChartType', e.target.value, optObj)
              }
              options={charts || []}
            />

            <Dropdown
              label="Range"
              name="range"
              value={optObj.range}
              onChange={(e) => handleChange('range', e.target.value, optObj)}
              options={range || []}
            />

            {chartObj.defaultChartType === 'stack bar' ? (
              <>
                <Dropdown
                  label="Aggregate field"
                  name="fieldInfoId"
                  value={optObj.fieldInfoId}
                  onChange={(e) =>
                    handleChange('fieldInfoId', e.target.value, optObj)
                  }
                  options={fieldsWithOptions || []}
                />

                <Dropdown
                  label="Label field"
                  name="fieldInfoId2"
                  value={optObj.fieldInfoId2}
                  onChange={(e) =>
                    handleChange('fieldInfoId2', e.target.value, optObj)
                  }
                  options={fieldsWithOptions || []}
                />
              </>
            ) : (
              <Dropdown
                label="Field"
                name="fieldInfoId"
                value={optObj.fieldInfoId}
                onChange={(e) => handleChange('fieldInfoId', e.target.value)}
                options={fieldsWithOptions || []}
              />
            )}
          </div>
        ))}

      {chartObj &&
        chartObj.type === 'list' &&
        Array.isArray(chartObj.options) &&
        chartObj.options.map((optObj) => (
          <div
            key={optObj.id}
            className="flex gap-2"
            style={{
              width: '100%',
              borderBottom: chartObj.type && '1px solid grey',
              marginBottom: '15px'
            }}
          >
            <Dropdown
              label="Range"
              name="range"
              value={optObj.range}
              onChange={(e) => handleChange('range', e.target.value, optObj)}
              options={range || []}
            />

            <Dropdown
              label="Field"
              name="fieldInfoId"
              value={optObj.fieldInfoId}
              onChange={(e) =>
                handleChange('fieldInfoId', e.target.value, optObj)
              }
              options={fieldsWithOptions || []}
            />
          </div>
        ))}

      {chartObj &&
        chartObj.type === 'table' &&
        Array.isArray(chartObj.options) &&
        chartObj.options.map((optObj) => (
          <div key={optObj.id}>
            <MultiSelect
              options={(fieldOptions || []).map((option) => ({
                label: option.label,
                value: option.value
              }))}
              placeholder="Select fields..."
              onChange={(e) =>
                handleChange('fieldInfoIds', e.target.value, optObj)
              }
              selectedValues={
                Array.isArray(optObj.fieldInfoIds) ? optObj.fieldInfoIds : []
              }
              label="Fields"
              name="fieldInfoIds"
              required={true}
              maxLength={10}
              indentType="col"
            />
          </div>
        ))}

      {chartObj &&
        Array.isArray(chartObj.options) &&
        chartObj.options.map((optObj) => (
          <div
            key={optObj.id}
            style={{ width: '100%' }}
            className="flex flex-col gap-3"
          >
            {console.log(optObj, 'obj')}
            <div class="flex space-x-1">
              <Input
                id="input_category"
                name="cardname"
                label={`${chartObj?.type?.charAt(0)?.toUpperCase() + chartObj?.type?.slice(1)} Label`}
                required
                value={optObj?.cardname}
                onChange={(e) => handleChange('cardname', e.target.value)}
                className="w-full"
              />
            </div>
            <div class="flex space-x-2">
              <Dropdown
                label="Field"
                name="fieldInfoId"
                value={optObj.fieldInfoId}
                onChange={(e) =>
                  handleChange('fieldInfoId', e.target.value, optObj)
                }
                options={fieldOptions || []}
                style={{ width: '100%', marginBottom: '10px' }}
                indentType="col"
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default FormConfiguration;
