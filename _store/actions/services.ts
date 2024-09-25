/* Importing the baseService, qRampStore, and Vue. */
import baseService from "src/modules/qcrud/_services/baseService.js";
import qRampStore from "../qRampStore.js";
import pluginsArray from 'src/plugins/array.js';
import { store } from 'src/plugins/utils'
import _ from 'lodash';
import serviceListStore from '../../_components/serviceList/store/serviceList'

/* A model for the service list. */
export const serviceListModel = {
    id: 0,
    title: "",
    dynamicField: [],
};
/**
 * It makes a request to the server, and returns the response data.
 * @returns An array of categories.
 */
export const getCategories = async (company?: null | []): Promise<any[]> => {
    if (store.hasAccess('ramp.categories.index')) {
        try {
            const companyId = company ? company : qRampStore().getFilterCompany();

            let requestParams = {
                params: {
                    include:
                        "products,products.attributes,products,products.attributes.values",
                    filter: {
                        companyId,
                    }
                },
            };
            const response = await baseService.index(
                "apiRoutes.qramp.categories",
                requestParams
            );
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    } else {
        return [];
    }
};

/**
 * It takes a list of categories, and for each category, it checks if the products are a list or a
 * dynamic field, and returns a new list of categories with the dynamic field added to each category.
 * @returns An array of objects.
 */
export async function buildServiceList(): Promise<any[]> {
    try {
        const categories = await getCategories();
        const categoryList = categories.length > 0 ? pluginsArray.tree(categories): [];
        const buildService = (item: any): any => {
            let dynamicField: any = {
                dynamicField: getIfItIsTypeListOrDynamicField(item.products),
            };
            dynamicField = dynamicField.dynamicField.length === 0 ? {} : dynamicField;
            let children = [];
            if (item.children && item.children.length > 0) {
                children = item.children.map(child => buildService(child));
            }
            return {
                id: item.id,
                title: item.name,
                ...dynamicField,
                lists: children
            };
        };

        const build = categoryList.filter(item => {
            const types = item.types || [];
            let businessUnitId = qRampStore().getBusinessUnitId();
            if (businessUnitId === 'null') {
              businessUnitId = null;
            }
            return item.businessUnitId == businessUnitId && types.includes(String(qRampStore().getTypeWorkOrder()));
        }).map(buildService);
        return build;
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * It takes a list of products, and returns a list of dynamic fields.
 * @param product -
 * @returns [
 *   {
 *     "icon": "settings",
 *     "id": "5e8f8f8f8f8f8f8f8f8f8f8f",
 *     "categoryId": "5e8f8f8f8f8f8f8f8f8f8f8f",
 *     "
 */
export const getIfItIsTypeListOrDynamicField = (product) => {
    try {

        const products = product || [];
        const data: any = [];
        const dynamicFieldModel: any = {
            icon: "fa-solid fa-gear",
        };
        const organizeProduct = organizeProducts(product);
        const favouriteProductIdList = serviceListStore().getFavouriteList().map(item => item.productId);
        organizeProduct?.forEach((product) => {
            const favourite = favouriteProductIdList.includes(product.id);
            const productName = product.externalId ?  `${product.name} (${product.externalId})` : product.name;
            dynamicFieldModel.id = product.id;
            dynamicFieldModel.categoryId = product.categoryId;
            dynamicFieldModel.title = productName;
            dynamicFieldModel.helpText = product.helpText;
            dynamicFieldModel.formField = getDynamicField(product);
            dynamicFieldModel.favourite = favourite;
            dynamicFieldModel.productType = product.type;
            data.push({ ...dynamicFieldModel });
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

/**
 * It takes an array of objects, and returns an object with the same keys as the array, but with the
 * values of the array replaced with the values of the object.
 * @param attributes
 * @returns {dynamicField}
 *
 */
function getDynamicField(product) {
    try {
        const productoType = product.type || null;
        const att = product.attributes || [];
        const optionAtt = product.options?.attributes || [];

        const result = {};
        const organizedData = optionAtt.length > 0 ? _.sortBy(att, item => optionAtt.indexOf(String(item.id))) : att;
        for (let i = 0; i < organizedData.length; i++) {
            const currentValue = organizedData[i];
            const propsOptions = currentValue.options?.props || {}
            const loadOptions = currentValue.options?.loadOptions ? {
              loadOptions : {
                ...currentValue.options?.loadOptions,
                requestParams: {
                  filter: {
                    workOrderId: qRampStore().getWorkOrderId(),
                  }
                }
              },
            } : {};
            const props = setProps(
            currentValue.type,
            currentValue.name,
            currentValue.values,
            productoType,
            i,
            );
            const key = `${currentValue.type}${currentValue.name ? currentValue.name : ""}`;
            const type = currentValue.type === "quantityFloat" ? "quantity" : currentValue.type;
            let value = currentValue.value ? currentValue.type === 'checkbox' ? Number(currentValue.value) : currentValue.value : currentValue.type === 'checkbox' ? 0 : null
            if(propsOptions.multiple) {
              value = value || [];
            }
            result[key] = {
                name: currentValue.name,
                value,
                type,
                id: currentValue.id,
                props: { ...props, ...propsOptions },
                ...loadOptions
            };
        }

        return result;
    } catch (error) {
        console.log(error);
    }
}

/**
 * It takes in a type, name, options, and index and returns an object with a readonly property and a
 * mask property.
 * @param type - "quantity | select | fullDate | quantityFloat"
 * @param name,
 * @param options - [{name: "", value: ""}]
 * @param index
 * @returns {PropsDynamicField}
 */
function setProps(type, name, options, productType, index) {
    const readonly = qRampStore().disabledReadonly();
    if (type == "quantity" || type == "quantityFloat") {
        return {
            label: name,
            readonly,
            type: "number",
            step: "0.1",
            mask: "###################",
        };
    }
    if (type == "select") {
        return {
            readonly,
            label: name,
            options: options.map((item) => {
                item.label = item.name;
                return item;
            }),
            type,
        };
    }
    if (type == "fullDate") {
        return {
            readonly,
            label: name,
            hint: "Format: MM/DD/YYYY HH:mm",
            mask: "MM/DD/YYYY HH:mm",
            "place-holder": "MM/DD/YYYY HH:mm",
            format24h: true,
        };
    }
    return {
        type: type,
        readonly,
        label: name,
    };
}

/**
 * It takes an array of objects, and returns an array of objects, where each object has a key of
 * "value" and a value of true.
 * @param data
 * @returns [
 *   {
 *     "name": "Service 1",
 *     "value": "Service 1"
 *   },
 *   {
 *     "name": "Service 2",
 *     "value": "Service 2"
 *   },
 *   {
 *     "name": "Service 3",
 *     "value": "Service 3"
 *   }
 * ]
 */
export function getListOfSelectedServices(data, isType = true) {
    try {
        const service = data.filter(item => {
            for (let key in item.formField) {
              const value = item.formField[key].value;
              if (Array.isArray(value) && value.length > 0) {
                return true;
              }

              if (!Array.isArray(value) && value) {
                return true;
              }
            }
            return false;
        });
        return productDataTransformation(service, isType) || [];
    } catch (error) {
        console.log(error);
    }
}
/**
 * If the productData array has a length greater than 0, then map over the data array and return a new
 * array with the product objects that have been updated with the values from the productData array.
 * @param {any} data - any =&gt; this is the data that is being mapped.
 * @returns The data is being returned as an array of objects.
 */
function organizeProducts(data: any) {
    const productData = qRampStore().getWorkOrderItems();
    if (productData?.length > 0) {
        return data?.map((product) => {
            (productData as any).map((sw) => {
                if (sw?.productId == product?.id) {
                    product?.attributes?.map((att) => {
                        sw.workOrderItemAttributes.map((swatt) => {
                            if (swatt.attributeId == att.id) {
                                att.value = swatt.value;
                                return swatt;
                            }
                        });
                        return att;
                    });
                }
                return sw;
            });
            return product;
        });
    } else {
        return data;
    }
}

/**
 * It takes an object, loops through it, and returns an array of objects with the key and value of the
 * original object.
 * @param obj
 * @returns An array of objects.
 */
function setAttr(obj) {
    try {
        const att: any = [];
        for (let key in obj) {
            const data = validationDataAttr(obj, key);
            att.push({ ...data });
        }
        return att;
    } catch (error) {
        console.log(error);
    }
}
/**
 * If the object has an id and attributeId, return an object with id, attributeId, name, value, and
 * type. If the object has an id and no attributeId, return an object with id, name, value, type, and
 * attributeId. If the object has an attributeId and value, return an object with attributeId, name,
 * value, and type.
 * @param {any} obj
 * @param {any} key - the key of the object
 * @returns {
 *   id: 1,
 *   attribute_id: 1,
 *   name: 'name',
 *   value: 'value',
 *   type: 'type',
 * }
 */
function validationDataAttr(obj: any, key: any) {
    let value = obj[key].type === 'quantity'
        ? !obj[key].value || obj[key].value == 0  ? null
        : Math.abs(obj[key].value) : obj[key].value;
    if(obj[key].type === 'select' && obj[key].props?.multiple) {
      value = JSON.stringify(obj[key].value);
    }
    let data: any = {
        name: obj[key].name,
        value,
        type: obj[key].type,
    };
    if (obj[key].id && obj[key].attributeId) {
        data = {
            id: obj[key].id,
            attribute_id: obj[key].attributeId,
            ...data,
        };
    }
    if (obj[key].id && !obj[key].attributeId) {
        data = {
            ...data,
            attribute_id: obj[key].id,
        };
    } else if (obj[key].attributeId && obj[key].value) {
        data = {
            ...data,
            attribute_id: obj[key].attributeId,
        };
    }
    return data;
}
/**
 * It takes an array of objects, and returns an array of objects with the same keys, but with different
 * values.
 * @param data - [{id: 1, formField: [{name: 'name', value: 'value'}]}]
 * @returns [
 *   {
 *     "product_id": "1",
 *     "work_order_item_attributes": [],
 *    }
 * ]
 */
export function productDataTransformation(data = [], isType = false) {
    try {
        const products: any = [];
        data.forEach((items: any) => {
            if (items.id || isDelete(items.formField)) {
                const productType = isType ? {product_type: items.productType, name: items.title }: {};
                products.push({
                    product_id: items.id,
                    ...productType,
                    work_order_item_attributes: setAttr(items.formField),
                });
            }
        });
        return products;
    } catch (error) {
        console.log(error);
    }
}

/**
 * It returns true if the object has at least one property with a value that is not an empty string.
 * @param obj - the object to be checked
 * @returns An array of objects.
 */
function isDelete(obj) {
    try {
        const att = []
        for (let key in obj) {
            return obj[key].value && obj[key].value != ""
        }
        return att
    } catch (error) {
        console.log(error);
    }
}
