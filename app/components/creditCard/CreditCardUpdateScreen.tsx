// app/components/creditCard/CreditCardUpdateScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Collapse,
} from '@mui/material';
import {
  Search,
  ExitToApp,
  CreditCard,
  Person,
  CalendarToday,
  Save,
  Cancel,
  Edit,
  CheckCircle,
  Warning,
  Info,
  KeyboardReturn,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useCreditCardUpdate } from '~/hooks/useCreditCardUpdate';

interface CreditCardUpdateScreenProps {
  onExit?: () => void;
}

interface LocationState {
  accountNumber?: string;
  cardNumber?: string;
  fromList?: boolean;
}

export function CreditCardUpdateScreen({ onExit }: CreditCardUpdateScreenProps) {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchForm, setSearchForm] = useState({
    accountId: state?.accountNumber || '',
    cardNumber: state?.cardNumber || '',
  });
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTestData, setShowTestData] = useState(false);

  // Datos de prueba para desarrollo
  const testData = [
    {
      accountId: '12345678901',
      cardNumber: '4532123456789012',
      description: 'Active Card - John Smith - Premium',
      status: 'Active',
      holderName: 'JOHN SMITH',
      expiry: '12/2025'
    },
    {
      accountId: '12345678901',
      cardNumber: '4532123456789013',
      description: 'Inactive Card - Jane Smith - Standard',
      status: 'Inactive',
      holderName: 'JANE SMITH',
      expiry: '08/2024'
    },
    {
      accountId: '98765432109',
      cardNumber: '5555666677778888',
      description: 'Active Card - Robert Johnson - Platinum',
      status: 'Active',
      holderName: 'ROBERT JOHNSON',
      expiry: '03/2026'
    },
    {
      accountId: '11111111111',
      cardNumber: '4111111111111111',
      description: 'Expired Card - Maria Garcia - Basic',
      status: 'Expired',
      holderName: 'MARIA GARCIA',
      expiry: '06/2023'
    },
    {
      accountId: '22222222222',
      cardNumber: '4222222222222222',
      description: 'Active Premium - Alice Brown - Gold',
      status: 'Active',
      holderName: 'ALICE BROWN',
      expiry: '09/2025'
    },
    {
      accountId: '33333333333',
      cardNumber: '4333333333333333',
      description: 'High Volume Account - David Wilson',
      status: 'Active',
      holderName: 'DAVID WILSON',
      expiry: '11/2026'
    },
  ];

  const {
    updateState,
    loading,
    error,
    handleAutoSearch,
    handleSearch,
    handleFieldChange,
    handleValidateChanges,
    handleSaveChanges,
    handleCancelChanges,
    handleExit,
    isFromList,
    canSave,
    canEdit,
  } = useCreditCardUpdate({
    onError: (error: string) => console.error('❌ Credit card update error:', error),
    onSuccess: (data: any) => console.log('✅ Credit card update success:', data.cardNumber),
  });

  // Auto-búsqueda cuando viene de la lista
  useEffect(() => {
    handleAutoSearch();
  }, [handleAutoSearch]);

  const handleInputChange = useCallback((field: 'accountId' | 'cardNumber') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    let processedValue = value;
    if (field === 'accountId' && value.length > 11) {
      processedValue = value.slice(0, 11);
    } else if (field === 'cardNumber' && value.length > 16) {
      processedValue = value.slice(0, 16);
    }
    
    // Solo permitir números
    processedValue = processedValue.replace(/\D/g, '');

    setSearchForm(prev => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchForm);
  }, [searchForm, handleSearch]);

  // Manejar selección de datos de prueba
  const handleTestDataSelect = useCallback((testItem: typeof testData[0]) => {
    const newSearchForm = {
      accountId: testItem.accountId,
      cardNumber: testItem.cardNumber,
    };
    
    setSearchForm(newSearchForm);
    handleSearch(newSearchForm);
    setShowTestData(false);
  }, [handleSearch]);

  // Handlers separados para TextField y Select
  const handleTextFieldUpdate = useCallback((field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    handleFieldChange(field as any, value);
  }, [handleFieldChange]);

  const handleSelectUpdate = useCallback((field: string) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    handleFieldChange(field as any, value);
  }, [handleFieldChange]);

  const handleValidateAndConfirm = useCallback(() => {
    handleValidateChanges();
  }, [handleValidateChanges]);

  const handleConfirmSave = useCallback(async () => {
    setShowConfirmDialog(false);
    await handleSaveChanges();
  }, [handleSaveChanges]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit ? onExit() : handleExit();
    } else if (event.key === 'F5' && canSave) {
      event.preventDefault();
      setShowConfirmDialog(true);
    } else if (event.key === 'F12' && canEdit) {
      event.preventDefault();
      handleCancelChanges();
    }
  }, [onExit, handleExit, canSave, canEdit, handleCancelChanges]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'BLOCKED': return 'error';
      case 'EXPIRED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'A':
      case 'Active':
        return 'Activa';
      case 'INACTIVE':
      case 'I':
      case 'Inactive':
        return 'Inactiva';
      case 'BLOCKED':
      case 'Blocked':
        return 'Bloqueada';
      case 'EXPIRED':
      case 'Expired':
        return 'Expirada';
      default:
        return status || '';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Expired': return 'warning';
      case 'Blocked': return 'error';
      default: return 'default';
    }
  };

  const getInfoMessage = () => {
    switch (updateState.changeAction) {
      case 'NOT_FETCHED':
        return 'Por favor ingresa el número de cuenta y el número de tarjeta';
      case 'SHOW_DETAILS':
        return 'Los detalles de la tarjeta se muestran arriba.';
      case 'CHANGES_NOT_OK':
        return 'Corrige los errores e intenta nuevamente.';
      case 'CHANGES_OK_NOT_CONFIRMED':
        return 'Cambios validados. Presiona F5 para guardar.';
      case 'CHANGES_OKAYED_AND_DONE':
        return 'Cambios registrados en la base de datos.';
      case 'CHANGES_FAILED':
        return 'Los cambios no se guardaron. Intenta otra vez.';
      default:
        return '';
    }
  };

  // Debug log
  console.log('🎯 CreditCardUpdateScreen state:', {
    changeAction: updateState.changeAction,
    canSave,
    canEdit,
    loading,
    error
  });

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CCUP"
          programName="COCRDUPC"
          title="Actualizar detalles de tarjeta de crédito"
        />

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              <Edit sx={{ mr: 1, verticalAlign: 'middle' }} />
              Actualizar detalles de tarjeta de crédito
            </Typography>
          </Box>

          {/* Formulario de búsqueda */}
          {updateState.changeAction === 'NOT_FETCHED' && (
            <Box sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Número de cuenta"
                      value={searchForm.accountId}
                      onChange={handleInputChange('accountId')}
                      error={!!updateState.validationErrors.accountId}
                      helperText={updateState.validationErrors.accountId || 'Requiere 11 dígitos'}
                      disabled={loading || isFromList}
                      fullWidth
                      inputProps={{ maxLength: 11 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body2" color="text.secondary">#</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          ...(isFromList && { bgcolor: alpha(theme.palette.info.main, 0.1) }),
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Número de tarjeta"
                      value={searchForm.cardNumber}
                      onChange={handleInputChange('cardNumber')}
                      error={!!updateState.validationErrors.cardNumber}
                      helperText={updateState.validationErrors.cardNumber || 'Requiere 16 dígitos'}
                      disabled={loading || isFromList}
                      fullWidth
                      inputProps={{ maxLength: 16 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          ...(isFromList && { bgcolor: alpha(theme.palette.info.main, 0.1) }),
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || isFromList}
                      startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                      fullWidth
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </Grid>
                </Grid>

                {isFromList && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    Los criterios de búsqueda provienen de la tarjeta seleccionada. Los datos se cargaron automáticamente.
                  </Alert>
                )}
              </Box>

              {/* Botón para mostrar datos de prueba (solo en desarrollo y cuando no viene de lista) */}
              {import.meta.env.DEV && !isFromList && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Info />}
                    onClick={() => setShowTestData(!showTestData)}
                    sx={{ borderRadius: 2 }}
                  >
                    {showTestData ? 'Ocultar' : 'Mostrar'} datos de prueba
                  </Button>
                </Box>
              )}

              {/* Lista de datos de prueba */}
              <Collapse in={showTestData}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mt: 2, 
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    borderColor: theme.palette.info.main,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom color="info.main" fontWeight={600}>
                    Tarjetas de prueba (solo desarrollo)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Haz clic en cualquier tarjeta para cargarla y editarla
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {testData.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Button
                          variant="text"
                          onClick={() => handleTestDataSelect(item)}
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            width: '100%',
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
                            <Grid item xs={12} sm={4}>
                              <Stack spacing={0.5}>
                              <Typography variant="body2" fontWeight={600} color="primary.main">
                                Cuenta: {item.accountId}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} color="secondary.main" sx={{ fontFamily: 'monospace' }}>
                                Tarjeta: {item.cardNumber}
                              </Typography>
                              </Stack>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" fontWeight={500}>
                                {item.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Titular: {item.holderName} • Vigencia: {item.expiry}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Chip
                                label={getStatusLabel(item.status)}
                                size="small"
                                color={getTestStatusColor(item.status) as any}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Instrucciones adicionales */}
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Consejos de prueba:</strong><br />
                      • Cada tarjeta de prueba tiene campos editables distintos<br />
                      • Prueba cambiar nombres, estados y fechas de vigencia<br />
                      • Usa F5 para guardar cambios, F12 para cancelar<br />
                      • Todos los datos de prueba son únicamente para desarrollo
                    </Typography>
                  </Box>
                </Paper>
              </Collapse>
            </Box>
          )}

          {/* Mensajes de Error */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Mensaje informativo */}
          {getInfoMessage() && (
            <Box sx={{ px: 3, py: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
              <Typography variant="body2" color="info.dark" fontWeight={500}>
                {getInfoMessage()}
              </Typography>
            </Box>
          )}

          {/* Detalles de la tarjeta para edición */}
          {updateState.oldDetails && updateState.newDetails && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Información no editable */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Información de la tarjeta
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Número de cuenta:
                          </Typography>
                          <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                            {updateState.oldDetails.accountId.toString().padStart(11, '0')}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Número de tarjeta:
                          </Typography>
                          <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                            {updateState.oldDetails.cardNumber}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Campos editables */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Detalles editables
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Stack spacing={2}>
                        <TextField
                          label="Nombre en la tarjeta"
                          value={updateState.newDetails.embossedName}
                          onChange={handleTextFieldUpdate('embossedName')}
                          error={!!updateState.validationErrors.embossedName}
                          helperText={updateState.validationErrors.embossedName}
                          disabled={!canEdit || loading}
                          fullWidth
                          inputProps={{ maxLength: 50 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />

                        <FormControl fullWidth disabled={!canEdit || loading}>
                          <InputLabel>Estado de la tarjeta</InputLabel>
                          <Select
                            value={updateState.newDetails.activeStatus}
                            onChange={handleSelectUpdate('activeStatus')}
                            error={!!updateState.validationErrors.activeStatus}
                            label="Estado de la tarjeta"
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="A">A - Activa</MenuItem>
                            <MenuItem value="I">I - Inactiva</MenuItem>
                          </Select>
                          {updateState.validationErrors.activeStatus && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                              {updateState.validationErrors.activeStatus}
                            </Typography>
                          )}
                        </FormControl>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            Fecha de vigencia:
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <TextField
                                label="Mes"
                                value={updateState.newDetails.expiryMonth}
                                onChange={handleTextFieldUpdate('expiryMonth')}
                                error={!!updateState.validationErrors.expiryMonth}
                                helperText={updateState.validationErrors.expiryMonth}
                                disabled={!canEdit || loading}
                                fullWidth
                                inputProps={{ maxLength: 2 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="Año"
                                value={updateState.newDetails.expiryYear}
                                onChange={handleTextFieldUpdate('expiryYear')}
                                error={!!updateState.validationErrors.expiryYear}
                                helperText={updateState.validationErrors.expiryYear}
                                disabled={!canEdit || loading}
                                fullWidth
                                inputProps={{ maxLength: 4 }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Estado actual */}
                <Grid item xs={12}>
                  <Card elevation={1}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary.main">
                        Estado actual
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={getStatusLabel(updateState.oldDetails.activeStatus)}
                          color={getStatusColor(updateState.oldDetails.activeStatus) as any}
                          icon={<CheckCircle />}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Vigencia actual: {updateState.oldDetails.expiryMonth}/{updateState.oldDetails.expiryYear}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Footer con controles */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
            >
              <Box>
                {updateState.changeAction === 'NOT_FETCHED' && (
                  <Typography variant="body2" color="text.secondary">
                    Ingresa número de cuenta y número de tarjeta para continuar
                  </Typography>
                )}
                {(updateState.changeAction === 'SHOW_DETAILS' || updateState.changeAction === 'CHANGES_NOT_OK') && (
                  <Typography variant="body2" color="text.secondary">
                    Realiza cambios y presiona ENTER para validar
                  </Typography>
                )}
                {updateState.changeAction === 'CHANGES_OK_NOT_CONFIRMED' && (
                    <Button
                      variant="contained"
                      onClick={() => setShowConfirmDialog(true)}
                      startIcon={<Save />}
                      disabled={loading}
                      sx={{ borderRadius: 2 }}
                    >
                      F5 = Guardar cambios
                    </Button>
                )}
              </Box>
              
              <Stack direction="row" spacing={1}>
                {/* Mostrar botón ENTER cuando se pueden hacer cambios */}
                {(updateState.changeAction === 'SHOW_DETAILS' || updateState.changeAction === 'CHANGES_NOT_OK') && (
                  <Button
                    variant="contained"
                    onClick={handleValidateAndConfirm}
                    startIcon={<KeyboardReturn />}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    ENTER = Validar
                  </Button>
                )}
                
                {canEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Cancel />}
                    onClick={handleCancelChanges}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F12 = Cancelar
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExitToApp />}
                  onClick={onExit || handleExit}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  F3 = Salir
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Dialog de confirmación */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Warning sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
            Confirmar cambios
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas guardar los cambios de esta tarjeta de crédito?
            </Typography>
            {updateState.newDetails && updateState.oldDetails && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Cambios por guardar:</Typography>
                <Stack spacing={1}>
                  {updateState.newDetails.embossedName !== updateState.oldDetails.embossedName && (
                    <Typography variant="body2">
                      Nombre: {updateState.oldDetails.embossedName} → {updateState.newDetails.embossedName}
                    </Typography>
                  )}
                  {updateState.newDetails.activeStatus !== (updateState.oldDetails.activeStatus === 'ACTIVE' ? 'A' : 'I') && (
                    <Typography variant="body2">
                      Estado: {getStatusLabel(updateState.oldDetails.activeStatus)} → {getStatusLabel(updateState.newDetails.activeStatus)}
                    </Typography>
                  )}
                  {(updateState.newDetails.expiryMonth !== updateState.oldDetails.expiryMonth || 
                    updateState.newDetails.expiryYear !== updateState.oldDetails.expiryYear) && (
                    <Typography variant="body2">
                      Vigencia: {updateState.oldDetails.expiryMonth}/{updateState.oldDetails.expiryYear} → {updateState.newDetails.expiryMonth}/{updateState.newDetails.expiryYear}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSave} 
              variant="contained" 
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
