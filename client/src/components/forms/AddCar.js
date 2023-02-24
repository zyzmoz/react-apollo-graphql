import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button, Divider, Form, Input, InputNumber, Select } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CAR, GET_CARS, GET_PEOPLE_AND_CARS } from "../../queries";

const AddCar = () => {
  const [id] = useState(uuidv4());
  const [addCar] = useMutation(ADD_CAR);
  const { data } = useQuery(GET_PEOPLE_AND_CARS);

  const [form] = Form.useForm();
  const [, forceUpdate] = useState();
  const [selectedPerson, setSelectedPerson] = useState();

  useEffect(() => {
    forceUpdate([]);
  }, []);

  const onChange = (value) => {
    setSelectedPerson(value);
  };

  const onFinish = (values) => {
    const { year, make, model, price } = values;

    addCar({
      variables: {
        id,
        year,
        make,
        model,
        price: String(price),
        personId: selectedPerson,
      },
      update: (cache, { data: { addCar } }) => {
        const data = cache.readQuery({ query: GET_CARS });

        cache.writeQuery({
          query: GET_CARS,
          data: {
            ...data,
            cars: [...data.cars, addCar],
          },
        });
      },
    });
  };

  return (
    <>
      {data?.people && data?.people?.length > 0 && (
        <Form
          name="add-car-form"
          form={form}
          layout="inline"
          onFinish={onFinish}
          size="large"
          style={{ marginBottom: "40px" }}
        >
          <Divider>Add Car</Divider>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Year" }]}
          >
            <Input placeholder="i.e. John" />
          </Form.Item>
          <Form.Item
            name="make"
            label="Make"
            rules={[{ required: true, message: "Make" }]}
          >
            <Input placeholder="Make" />
          </Form.Item>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Model" }]}
          >
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="person"
            style={{ width: "250px" }}
            label="Person"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChange}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
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
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Add Car
              </Button>
            )}
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default AddCar;
