class GroupWorker {
    /**
     * constructor
     */
    constructor() {
        this.createCacheHandler = this.createCache.bind(this);
        this.createGroupPerspectiveHandler = this.createGroupPerspective.bind(this);
        this.disposeGroupPerspectiveHandler = this.disposeGroupPerspective.bind(this);
        this.disposeCacheHandler = this.disposeCache.bind(this);
        this.getGroupPerspectiveHandler = this.getGroupPerspective.bind(this);
        this.getRecordsForHandler = this.getRecordsFor.bind(this);

        this.functionMap = new Map();
        this.functionMap.set("createCache", this.createCacheHandler);
        this.functionMap.set("createGroupPerspective", this.createGroupPerspectiveHandler);
        this.functionMap.set("disposeGroupPerspective", this.disposeGroupPerspectiveHandler);
        this.functionMap.set("disposeCache", this.disposeCacheHandler);
        this.functionMap.set("getGroupPerspective", this.getGroupPerspectiveHandler);
        this.functionMap.set("getRecordsFor", this.getRecordsForHandler);

        this.dataCache = new Map();
    }

    /**
     * dispose
     */
    dispose() {
        this.createCacheHandler = null;
        this.createGroupPerspectiveHandler = null;
        this.disposeGroupPerspectiveHandler = null;
        this.disposeCacheHandler = null;
        this.getGroupPerspectiveHandler = null;
        this.getRecordsForHandler = null;

        this.functionMap.clear();
        this.functionMap = null;
    }

    /**
     * process all incomming messages mapping it to handlers
     * @param args
     */
    onMessage(args) {
        if (this.functionMap.has(args.msg)) {
            this.functionMap.get(args.msg)(args);
        }
    }

    /**
     * create cache from data sent to worker
     * @param args
     */
    createCache(args) {
        if (this.dataCache.has(args.id)) {
            const dataCache = this.dataCache.get(args.id);
            dataCache.data = args.data;
            dataCache.updateAllPerspectives();
        }
        else {
            this.dataCache.set(args.id, new DataCache(args.data));
        }

        postMessage({
            msg: "getRecordsForResponse",
            id: args.id,
            data: args.data
        })

    }

    /**
     * create a group perspective for data cached
     * @param args
     */
    createGroupPerspective(args) {
        const id = args.id;
        const perspectiveId = args.perspectiveId;
        const fieldsToGroup = args.fieldsToGroup;
        const aggegateOptions = args.aggegateOptions;

        const dataCache = this.dataCache.get(id);
        if (dataCache) {
            let perspective = dataCache.getPerspective(perspectiveId);

            if (perspective == null) {
                perspective = dataCache.createPerspective(perspectiveId, fieldsToGroup, aggegateOptions);
                postMessage({
                    msg: "createGroupPerspectiveResponse",
                    id: id,
                    perspectiveId: perspectiveId,
                    data: perspective
                })
            }
        }
    }

    /**
     * remove perspective
     * @param args
     */
    disposeGroupPerspective(args) {
        const id = args.id;
        const perspectiveId = args.perspectiveId;

        if (this.dataCache.has(id)) {
            const cache = this.dataCache.get(id);
            cache.disposePerspective(perspectiveId);
        }
    }

    /**
     * remove perspectives and cache
     * @param args
     */
    disposeCache(args) {
        const id = args.id;

        if (this.dataCache.has(id)) {
            const cache = this.dataCache.get(id);
            cache.dispose();

            this.dataCache.delete(id);
        }
    }

    /**
     * Return existing perspective
     * @param args 
     */
    getGroupPerspective(args){
        const id = args.id;
        const perspectiveId = args.perspectiveId;

        if (this.dataCache.has(id)) {
            const cache = this.dataCache.get(id);
            const perspective = cache.getPerspective(perspectiveId);

            postMessage({
                msg: "getGroupPerspectiveResponse",
                id: id,
                perspectiveId: perspectiveId,
                data: perspective
            })
        }
    }

    /**
    * Filter records based on args argument
    * @params args 
    */
    getRecordsFor(args){
        const id = args.id;
        const perspectiveId = args.perspectiveId;
        const filters = args.filters;

        if (this.dataCache.has(id)) {
            const cache = this.dataCache.get(id);
            const items = cache.getRecordsFor(cache.data, filters);

            postMessage({
                msg: "getRecordsForResponse",
                id: id,
                data: items
            })
        }
    }
    
}

class DataCache {
    constructor(data) {
        this.data = data;
        this.perspectiveGrouping = new Map()
    }

    dispose() {
        this.data = null;

        this.perspectiveGrouping.clear();
        this.perspectiveGrouping = null;
    }

    // process all perspectives again
    updateAllPerspectives() {

    }

    /**
     * Remove a perspective from the cache
     * @param perspectiveId
     */
    disposePerspective(perspectiveId) {
        if (this.perspectiveGrouping.has(perspectiveId)) {
            this.perspectiveGrouping.delete(perspectiveId);
        }
    }

    /**
     * Return an existing perspective
     * @param perspectiveId 
     */
    getPerspective(perspectiveId){
        if (this.perspectiveGrouping.has(perspectiveId)) {
            return this.perspectiveGrouping.get(perspectiveId);
        }

        return null;
    }

    /**
     * Filter records based on filter array argument
     * @param items 
     * @param filters 
     */
    getRecordsFor(items, filters)
    {
        if (!filters) {
            return items;
        }

        let result = items.slice(0);

        result = result.filter(function(el) {
            for(var j = 0; j < filters.length; j++){
                var fieldName = filters[j].fieldName;
                var value = filters[j].value;
                
                if(el[fieldName] != value){
                    return false;
                }
            }
            return true;
        });

        return result;
    }

    /**
     * Create a perspective and group
     * @param perspectiveId
     * @param fieldsToGroup
     * @param aggegateOptions
     */
    createPerspective(perspectiveId, fieldsToGroup, aggegateOptions) {
        const existingPerspective = this.getPerspective(perspectiveId);
        
        if(!existingPerspective)
        {
            const newPerspective = this.createPerspectiveGroup(fieldsToGroup, aggegateOptions);
            this.perspectiveGrouping.set(perspectiveId, newPerspective);
            return newPerspective;
        }

        return existingPerspective;
    }

    /**
     * Create a grouped and aggregated perspective from the data and store it with a key so that I can access it at any time from other views
     * More than one view can use the same perspective, a example of tha is the grid on master detail and the group chart on the list
     * @param fieldsToGroup: what fields are used in this grouping to define the perspective
     * @param aggegateOptions: what are the calculations that need to be made on the group
     */
    createPerspectiveGroup(fieldsToGroup, aggegateOptions) {
        const dataCopy = this.data.slice(0);

        const root = {
            level: 0,
            title: "None",
            items: dataCopy,
            isGroup: true
        };

        this.groupRecursive(root, fieldsToGroup, aggegateOptions);
        return root;
    }

    /**
     * Recursivly group items of a group oject grouping it according to level and the field defined for that level.
     * @param group: the group to process
     * @param fieldsToGroup: what are the fields to use while grouping
     * @param aggegateOptions: what aggregate calculations should be used
     */
    groupRecursive(group, fieldsToGroup, aggegateOptions) {
        if (fieldsToGroup == undefined || fieldsToGroup == null) {
            return;
        }

        if (group.level > fieldsToGroup.length -1) {
            group.aggregate = {
                aggregate: aggegateOptions.aggregate,
                value: aggregator[aggegateOptions.aggregate](group.items, aggegateOptions.field)
            };

            group.lowestGroup = true;
            return;
        }

        group.groups = this.group(group.items, fieldsToGroup[group.level], group.level + 1);

        const keys = group.groups.keys();

        for(let key of keys) {
            const childGroup = group.groups.get(key);
            this.groupRecursive(childGroup, fieldsToGroup, aggegateOptions);
        }

        group.aggregate = {
            aggregate: aggegateOptions.aggregate,
            value: aggregator[aggegateOptions.aggregate](group.items, aggegateOptions.field)
        };

        group.items = Array.from(group.groups, items => items[1]);
        delete group.groups;
    }

    /**
     * Create a
     * @param array
     * @param fieldName
     * @param level
     * @returns {any|*}
     */
    group(array, fieldName, level) {
        return array.reduce((groupMap, curr) => {
            const key = curr[fieldName];
            const id = curr[fieldName];
            const groupId = groupMap.size;

            if (groupMap.has(key)) {
                groupMap.get(key).items.push(curr);
            }
            else {
                groupMap.set(key, {
                    level: level,
                    field: fieldName,
                    title: key ? key.toString() : "none",
                    id: id,
                    items: [curr],
                    index: groupId,
                    isGroup: true
                })
            }

            return groupMap;
        }, new Map())
    }
}

const aggregator = {
    count(items) {
        return items.length;
    },

    sum(items, field) {
        let result = 0;

        for(let item of items) {
            result += item[field];
        }

        return result;
    },

    min(items, field) {
        let result = items[0][field];

        for(let item of items) {
            if (item[field] < result) {
                result = item[field];
            }
        }

        return result;
    },

    max(items, field) {
        let result = items[0][field];

        for(let item of items) {
            if (item[field] > result) {
                result = item[field];
            }
        }

        return result;
    },

    ave(items, field) {
        let result = this.sum(items, field);

        result = result / items.length;

        return result;
    }
};


const groupWorker = new GroupWorker();

onmessage = function(event) {
    groupWorker.onMessage(event.data);
};