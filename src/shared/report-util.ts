import { Vue } from "vue-property-decorator";
import { map, compact, concat, flattenDeep, groupBy, filter, orderBy, forEach } from "lodash-es";


export default {

    //  groupViewCustomization: any = { groupColumns: [],sortFields: []};
    getReOrgGroupTableSource(orginTableSource: any, newGroupSource: any) {
        if (newGroupSource.sortFields && newGroupSource.sortFields.length > 0) {
            let usableSorts = filter(newGroupSource.sortFields, (item: any) => item.sort);
            if (usableSorts.length > 0) {
                let sortNames = map(usableSorts, 'name');
                let sortDescOrAscs = map(usableSorts, 'sort');
                orginTableSource = orderBy(orginTableSource, sortNames, sortDescOrAscs);
            }

        }
        if (newGroupSource.groupColumns.length > 0) {
            orginTableSource = groupBy(orginTableSource, (item: any) => {
                let ret = '';
                forEach(newGroupSource.groupColumns, (head: any) => {
                    let value = item[head];
                    if (!value) {
                        value = "Unselected";
                    }
                    ret += `${head} : ${value} ; `;
                });
                return ret;
            });
        }
        return orginTableSource;
    },


    getNestedColumnList(customizitionTableView: any) {
        let generalColumnList = map(customizitionTableView.generalLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(generalColumnList);
    },

    getDetailColumnList(customizitionTableView: any) {
        if (!customizitionTableView.detailLevelFieldMappings) return [];
        let detailColumnList = map(customizitionTableView.detailLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(detailColumnList);
    },
    getIDLevelColumnList(customizitionTableView: any) {
        if (!customizitionTableView.idLevelFieldMappings) return [];
        let idLevelColumnList = map(customizitionTableView.idLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(idLevelColumnList);
    },
    getCartonLevelColumnList(customizitionTableView: any) {
        if (!customizitionTableView.cartonLevelFieldMappings) return [];
        let cartonLevelColumnList = map(customizitionTableView.cartonLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(cartonLevelColumnList);
    },

    getFlatColumnList(customizitionTableView: any) {
        let generalColumnList = map(customizitionTableView.generalLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        let detailColumnList = map(customizitionTableView.detailLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });

        let idLevelColumnList = map(customizitionTableView.idLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        let cartonLevelColumnList = map(customizitionTableView.cartonLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });

        return compact(flattenDeep(concat(generalColumnList, detailColumnList, idLevelColumnList, cartonLevelColumnList)));
    },

    getExcelColumnList(customizitionTableView: any) {
        let generalColumnList = map(customizitionTableView.generalLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        let detailColumnList = map(customizitionTableView.detailLevelFieldMappings, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });

        return compact(flattenDeep(concat(generalColumnList, detailColumnList)));
    },

    getGeneralDynFields(customizitionTableView: any) {
        if (!customizitionTableView.generalDynFields) return [];
        let generalDynFields = map(customizitionTableView.generalDynFields, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(generalDynFields);
    },

    getDetailDynFields(customizitionTableView: any) {
        if (!customizitionTableView.detailDynFields) return [];
        let detailDynFields = map(customizitionTableView.detailDynFields, (mapping) => {
            if (mapping.isDefaultField) {
                return mapping.customerField;
            }
        });
        return compact(detailDynFields);
    }

};