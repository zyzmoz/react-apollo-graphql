import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { GET_PEOPLE_AND_CARS, UPDATE_CAR } from "../../queries";

const UpdateCar = (props) => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [id] = useState(props.id);
  const [year, setYear] = useState(props.year);
  const [make, setMake] = useState(props.make);
  const [model, setModel] = useState(props.model);
  const [price, setPrice] = useState(props.price);

  const [updateCar] = useMutation(UPDATE_CAR);
  const { data } = useQuery(GET_PEOPLE_AND_CARS);

  useEffect(() => {
    forceUpdate();
  }, []);

  const onFinish = (values) => {
    updateCar({
      variables: {
        id,
        year,
        make,
        model,
        price: String(price),
        personId: props.personId,
      },
    });
    props.onButtonClick();
  };

  const updateStateVariable = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    props.updateStateVariable(name, value);
    switch (name) {
      case "year":
        setYear(value);
        break;
      case "make":
        setMake(value);
        break;
      case "model":
        setModel(value);
        break;
      case "price":
        setPrice(value);
        break;
      default:
        break;
    }
  };

  return (
    <Form
      form={form}
      name="update-car-form"
      layout="inline"
      onFinish={onFinish}
      size="large"
      initialValues={{
        id,
        year,
        make,
        model,
        price,
        personId: props.personId,
      }}
    >
      <Form.Item
        name="year"
        label="Year"
        rules={[{ required: true, message: "Year" }]}
      >
        <Input name="year" placeholder="i.e. John" onChange={updateStateVariable} />
      </Form.Item>
      <Form.Item
        name="make"
        label="Make"
        rules={[{ required: true, message: "Make" }]}
      >
        <Input name="make" placeholder="Make" onChange={updateStateVariable} />
      </Form.Item>
      <Form.Item
        name="model"
        label="Model"
        rules={[{ required: true, message: "Model" }]}
      >
        <Input name="model" placeholder="Model" onChange={updateStateVariable} />
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
          onChange={(value) =>
            updateStateVariable({ target: { name: "price", value } })
          }
        />
      </Form.Item>
      <Form.Item
        name="personId"
        style={{ width: "250px" }}
        label="Person"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select a person"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          disabled
          options={data?.people?.map((p) => ({
            value: p.id,
            label: `${p.firstName} ${p.lastName}`,
          }))}
        />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldTouched("year") ||
              !form.isFieldTouched("make") ||
              !form.isFieldTouched("model") ||
              !form.isFieldTouched("price") ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Update Car
          </Button>
        )}
      </Form.Item>
      <Button onClick={props.onButtonClick}>Cancel</Button>
    </Form>
  );
};

export default UpdateCar;
