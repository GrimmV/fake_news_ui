

export function handle_module_information(modules_in) {

    const visualization_modules = []
    const explanation_modules = []

    for (let elem of modules_in) {
        visualization_modules.push({
            name: elem["module"],
            params: elem["parameters"],
            param_options: elem["param_options"]
        })
        explanation_modules.push({
            name: elem["module"],
            explanation: elem["explanation"]
        })
    }

    return [visualization_modules, explanation_modules]

}