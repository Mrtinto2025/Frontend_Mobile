import React,{useState, useEfect} from "react";
import { View, Text, Flatlist, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, ScrollView} from "react-native";
import { categoriesSyles} from "../styles/CategoriesSyles";
import { categoryService, authService} from "../services/api";

export default function CategoriesScreen(){
    const [categories, setCategories] = useState<any>[]([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({name : "", description: ""});
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEfect (() => {
        loadCurrentUser();
        loadCategories();
    }, []);

    const loadCurrentUser = async () => {
        try{
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        }catch(error){
            console.error("error al cargar usuario:", error);
        }
    };

    const loadCategories = async () => {
        setLoading(true);
        setError("");
        try{
            const response = await categoryService.getAll();
            setCategories(response?.data || []);
        }catch(error){
            setError("No se pudieron cargar las categorias :33");
            setCategories([]);
        } finally{
            setLoading(false);
        }
    };

    const handlesave = async () => {
        if(!formData.name.trim()){
            Alert.alert("Error", "el nombre es obligatorio");
            return;
        }
        
        try{
            if(editing){
                await categoryService.update(editing.id, formData);
                Alert.alert("Exito","categoria actualizada exitosamente");
            }else{
                await categoryService.create(formData);
                Alert.alert("Exito", "categoria creada exitosamente");
                setModalVisible(false);
                resetForm();
                loadCategories();
            }
        }catch(error){
            Alert.alert("Error","No se pudo guardar la categoria");
        }
    };

    const handleDelete = async (item: any) => {
        if(currentUser?.role !== "admin"){
            Alert.alert("Acceso denegado", "Solo los administradores pueden eliminar categorias");
            return;
        }
        Alert.alert("Confiar",`¿eliminar ${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try{
                        await categoryService.delete(item.id);
                        Alert.alert("Exito", "categoria eliminada exitosamente");
                        loadCategories();
                    }catch(error){
                        Alert.alert("Error", "No se pudo eliminar la categoria");
                    }
                }
            }
        ])
    };


    const handleToggleActive = (item: any) => {
        const action = item.active ? 'Desactivar' : 'Activar';
        Alert.alert('confirmar', `¿${action.charAt(0).toUpperCase() + action.slice(1)} ${item.name}?`,
    [
        {text: "Cancelar", style: "cancel"},
        {
            text: action.charAt(0).toUpperCase() +action.slice(1),
            onPress: async () => {
                try{
                    await categoryService.update(item.id, {
                        name: item.name,
                        description: item.description,
                        active: !item.active 
                    });
                    Alert.alert('Exito', `categoria ${item.active ? 'desactivada' : 'activada'}`);
                    loadCategories();              
                }catch(error){
                    Alert.alert('Error', `No se pudo ${action}`);
                }
            }
        }
    ] )
    }
   const renderCategory = ({ item }: {item: any}) =>(
        <View style={categoriesSyles.categoryCard}> 
            <View style={ categoriesSyles.categoryInfo}>
                <Text style={categoriesSyles.categoryName}>
                    {item.name} {!item.active && <Text style={{color: "#999"}}> (Inactive)</Text>}
                </Text>
                {item.description &&(
                <Text style={categoriesSyles.categoryDescription}>{item.description}</Text>
                )}
            </View>

            <View style={categoriesSyles.actionsContainer}>  
                <TouchableOpacity
                style={[categoriesSyles.activeButton, item.active ? categoriesSyles.deleteButton : categoriesSyles.
                    editingButton
                ]} onPress={() => handleToggleActive(item)}>
                    <Text style={[categoriesSyles.actionButtonText, item.active ? categoriesSyles.deleteButtonText :
                        categoriesSyles.editingButtonText
                    ]}>
                        {item.active ? "Desactivar" : "Activar"}
                    </Text>
                </TouchableOpacity>
                {currentUser?.role === "admin" && (
                    <TouchableOpacity style={[categoriesSyles.actionButton,categoriesSyles.deleteButton]}
                    onPress={() => handleDelete(item)}>
                        <Text style={[categoriesSyles.actionButtonText, categoriesSyles.deleteButtonText]}>
                            Eliminar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>  
        </View>
    );

    if(loading){
        return(
            <View style={categoriesSyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff"></ActivityIndicator>
                <Text style={categoriesSyles.loadingText}> Cargando...</Text>
            </View>
        );
    }

    return(
        <View style={categoriesSyles.container}>
            <View style={categoriesSyles.header}>
                <View style={categoriesSyles.headerContext}>
                    <Text style={categoriesSyles.headerTitle}> Gestiones de Categorias</Text>
                    <TouchableOpacity style={categoriesSyles.addButton} onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}>
                        <Text style={categoriesSyles.addButtonText}> Nueva Categoria</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {error?(
                <View style= {categoriesSyles.errorContainer}>
                    <Text style={categoriesSyles.errorText}>{error}</Text>
                    <TouchableOpacity style={categoriesSyles.retryButton} onPress={loadCategories}>
                        <Text style={categoriesSyles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ): null}
        </View>
    );
}
