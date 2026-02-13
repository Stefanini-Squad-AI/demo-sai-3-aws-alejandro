// app/components/creditCard/CreditCardDetailScreen.tsx (ACTUALIZADO con datos de prueba)
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Collapse,
} from '@mui/material';
import {
  Search,
  ExitToApp,
  CreditCard,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
  KeyboardReturn,
  Block,
  Schedule,
  Info,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useCreditCardDetail } from '~/hooks/useCreditCardDetail';
import type { CreditCardDetailRequest } from '~/types/creditCardDetail';

interface CreditCardDetailScreenProps {
  onExit?: () => void;
}

interface LocationState {
  accountNumber?: string;
  cardNumber?: string;
  fromList?: boolean;
}

export function CreditCardDetailScreen({ onExit }: CreditCardDetailScreenProps) {
  const theme = useTheme();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [searchForm, setSearchForm] = useState<CreditCardDetailRequest>({
    accountId: state?.accountNumber || '',
    cardNumber: state?.cardNumber || '',
  });

  const [isFromList, setIsFromList] = useState(false);
  const [showTestData, setShowTestData] = useState(false);
  const hasAutoSearched = useRef(false);
  const searchAttempted = useRef(false);

  // ✅ NUEVO: Datos de prueba para desarrollo
  const testData = [
    {
      accountId: '12345678901',
      cardNumber: '4532123456789012',
      description: 'Active Card - John Smith - Premium',
      status: 'Active',
      holderName: 'JOHN SMITH'
    },
    {
      accountId: '12345678901',
      cardNumber: '4532123456789013',
      description: 'Inactive Card - Jane Smith - Standard',
      status: 'Inactive',
      holderName: 'JANE SMITH'
    },
    {
      accountId: '98765432109',
      cardNumber: '5555666677778888',
      description: 'Active Card - Robert Johnson - Platinum',
      status: 'Active',
      holderName: 'ROBERT JOHNSON'
    },
    {
      accountId: '11111111111',
      cardNumber: '4111111111111111',
      description: 'Expired Card - Maria Garcia - Basic',
      status: 'Expired',
      holderName: 'MARIA GARCIA'
    },
    {
      accountId: '22222222222',
      cardNumber: '4222222222222222',
      description: 'Active Premium - Alice Brown - Gold',
      status: 'Active',
      holderName: 'ALICE BROWN'
    },
    {
      accountId: '33333333333',
      cardNumber: '4333333333333333',
      description: 'High Volume Account - David Wilson',
      status: 'Active',
      holderName: 'DAVID WILSON'
    },
  ];

  const {
    data,
    loading,
    error,
    validationErrors,
    handleSearch,
    handleExit,
    formatExpiryDate,
  } = useCreditCardDetail({
    onError: (error) => {
      console.error('❌ Credit card detail error:', error);
      searchAttempted.current = true;
    },
    onSuccess: (data) => {
      console.log('✅ Credit card detail loaded successfully:', data.cardNumber);
      searchAttempted.current = true;
    },
  });

  useEffect(() => {
    console.log('🔄 useEffect triggered:', {
      hasState: !!(state?.accountNumber && state?.cardNumber),
      hasAutoSearched: hasAutoSearched.current,
      searchAttempted: searchAttempted.current,
      loading,
      hasData: !!data,
      hasError: !!error
    });

    if (state?.accountNumber && 
        state?.cardNumber && 
        !hasAutoSearched.current && 
        !searchAttempted.current &&
        !loading) {
      
      console.log('🚀 Starting auto-search...');
      setIsFromList(true);
      hasAutoSearched.current = true;
      
      const searchData = {
        accountId: state.accountNumber,
        cardNumber: state.cardNumber,
      };
      
      console.log('🔍 Auto-searching with data:', searchData);
      handleSearch(searchData);
    }
  }, [state?.accountNumber, state?.cardNumber, loading]);

  useEffect(() => {
    return () => {
      hasAutoSearched.current = false;
      searchAttempted.current = false;
    };
  }, []);

  const handleInputChange = useCallback((field: keyof CreditCardDetailRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    let processedValue = value;
    if (field === 'accountId' && value.length > 11) {
      processedValue = value.slice(0, 11);
    } else if (field === 'cardNumber' && value.length > 16) {
      processedValue = value.slice(0, 16);
    }
    
    if (field === 'accountId' || field === 'cardNumber') {
      processedValue = processedValue.replace(/\D/g, '');
    }

    setSearchForm(prev => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log('📝 Manual search submitted:', searchForm);
    searchAttempted.current = false;
    handleSearch(searchForm);
  }, [searchForm, handleSearch]);

  // ✅ NUEVO: Manejar selección de datos de prueba
  const handleTestDataSelect = useCallback((testItem: typeof testData[0]) => {
    const newSearchForm = {
      accountId: testItem.accountId,
      cardNumber: testItem.cardNumber,
    };
    
    setSearchForm(newSearchForm);
    searchAttempted.current = false;
    hasAutoSearched.current = false;
    handleSearch(newSearchForm);
    setShowTestData(false);
  }, [handleSearch]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying search...');
    searchAttempted.current = false;
    hasAutoSearched.current = false;
    
    const searchData = {
      accountId: state?.accountNumber || searchForm.accountId,
      cardNumber: state?.cardNumber || searchForm.cardNumber,
    };
    
    handleSearch(searchData);
  }, [state, searchForm, handleSearch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit ? onExit() : handleExit();
    }
  }, [onExit, handleExit]);

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
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      case 'BLOCKED': return 'Bloqueada';
      case 'EXPIRED': return 'Expirada';
      default: return 'Desconocido';
    }
  };

  const getExpiryStatusLabel = (status?: string) => (
    status === 'EXPIRED' ? 'Expirada' : 'Válida'
  );

  const getTestStatusLabel = (status: string) => {
    const normalized = status.toUpperCase();
    switch (normalized) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      case 'BLOCKED': return 'Bloqueada';
      case 'EXPIRED': return 'Expirada';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle />;
      case 'INACTIVE': return <Cancel />;
      case 'BLOCKED': return <Block />;
      case 'EXPIRED': return <Schedule />;
      default: return <Cancel />;
    }
  };

  // ✅ NUEVO: Función para obtener color de estado de prueba
  const getTestStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'EXPIRED': return 'warning';
      case 'BLOCKED': return 'error';
      default: return 'default';
    }
  };

  const expiryDate = formatExpiryDate(data?.expiryMonth, data?.expiryYear);

  console.log('🎯 Component render state:', {
    data,
    loading,
    error,
    validationErrors
  });

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CCDL"
          programName="COCRDSLC"
          title="Detalle de tarjetas"
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
            <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
            Detalles de la tarjeta
          </Typography>
          </Box>

          {/* Formulario de búsqueda */}
          <Box sx={{ p: 3 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mb: 3 }}
            >
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Número de cuenta"
                    value={searchForm.accountId}
                    onChange={handleInputChange('accountId')}
                    error={!!validationErrors.accountId}
                    helperText={validationErrors.accountId || 'Se requieren 11 dígitos'}
                    disabled={loading || isFromList}
                    fullWidth
                    inputProps={{
                      maxLength: 11,
                      pattern: '[0-9]*',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary">
                            #
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        ...(isFromList && {
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                        }),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <TextField
                    label="Número de tarjeta"
                    value={searchForm.cardNumber}
                    onChange={handleInputChange('cardNumber')}
                    error={!!validationErrors.cardNumber}
                    helperText={validationErrors.cardNumber || 'Se requieren 16 dígitos'}
                    disabled={loading || isFromList}
                    fullWidth
                    inputProps={{
                      maxLength: 16,
                      pattern: '[0-9]*',
                    }}
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
                        ...(isFromList && {
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                        }),
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
                  Los criterios de búsqueda se completaron desde la tarjeta seleccionada. Datos cargados automáticamente.
                </Alert>
              )}
            </Box>

            {/* ✅ NUEVO: Botón para mostrar datos de prueba (solo en desarrollo y cuando no viene de lista) */}
            {import.meta.env.DEV && !isFromList && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Info />}
                  onClick={() => setShowTestData(!showTestData)}
                  sx={{ borderRadius: 2 }}
                >
                  {showTestData ? 'Ocultar datos de prueba' : 'Mostrar datos de prueba'}
                </Button>
              </Box>
            )}

            {/* ✅ NUEVO: Lista de datos de prueba */}
            <Collapse in={showTestData}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  borderColor: theme.palette.info.main,
                }}
              >
                <Typography variant="subtitle2" gutterBottom color="info.main" fontWeight={600}>
                  Tarjetas de prueba (solo para desarrollo)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Seleccione una tarjeta para ver sus detalles
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
                          
                          <Grid item xs={12} sm={5}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Titular: {item.holderName}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Chip
                              label={getTestStatusLabel(item.status)}
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
                    • Cada tarjeta de prueba tiene distintos estados y fechas de vencimiento<br />
                    • Use estas tarjetas para validar varios escenarios<br />
                    • Los datos mostrados son únicamente para desarrollo<br />
                    • Los datos de producción reales tienen reglas de validación distintas
                  </Typography>
                </Box>
              </Paper>
            </Collapse>

            {/* Mensajes de Error con opción de reintentar */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleRetry}
                    disabled={loading}
                  >
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            )}

            {/* Mostrar errores del backend */}
            {data && !data.success && data.errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {data.errorMessage}
              </Alert>
            )}

            {/* Mensaje informativo cuando no hay datos */}
            {!data && !loading && !error && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Ingrese número de cuenta y número de tarjeta
              </Alert>
            )}

            {/* Detalles de la tarjeta */}
            {data && data.success && (
              <>
                {data.infoMessage && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {data.infoMessage}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {/* Información básica de la tarjeta */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Información de la tarjeta
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Número de cuenta:
                            </Typography>
                            <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                              {data.accountId.toString().padStart(11, '0')}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Número de tarjeta:
                            </Typography>
                            <Typography variant="h6" fontFamily="monospace" fontWeight={600}>
                              {data.cardNumber}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Estado de la tarjeta:
                            </Typography>
                            <Chip
                              label={getStatusLabel(data.activeStatus)}
                              color={getStatusColor(data.activeStatus) as any}
                              icon={getStatusIcon(data.activeStatus)}
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información del titular y fechas */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={1} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Detalles del titular
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2.5}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Nombre en la tarjeta:
                            </Typography>
                            <Typography variant="h6" fontWeight={500}>
                              {data.embossedName || 'N/A'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                              Fecha de vencimiento:
                            </Typography>
                            <Typography variant="h6" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                              {expiryDate.month && expiryDate.year 
                                ? `${expiryDate.month}/${expiryDate.year}`
                                : 'N/A'
                              }
                            </Typography>
                          </Box>

                          {data.cvvCode && (
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Código CVV:
                              </Typography>
                              <Typography variant="body1" fontFamily="monospace" fontWeight={500}>
                                ***
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Información adicional de seguridad */}
                  <Grid item xs={12}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary.main">
                          Información de seguridad
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Estado de la tarjeta
                              </Typography>
                              <Chip
                                label={getStatusLabel(data.activeStatus)}
                                color={getStatusColor(data.activeStatus) as any}
                                icon={getStatusIcon(data.activeStatus)}
                                variant="filled"
                                size="medium"
                                sx={{ 
                                  fontWeight: 600, 
                                  fontSize: '1rem',
                                  px: 2,
                                  py: 1,
                                  height: 40,
                                }}
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Estado de vencimiento
                              </Typography>
                              <Chip
                                label={getExpiryStatusLabel(data.activeStatus)}
                                color={
                                  data.activeStatus === 'EXPIRED' 
                                    ? 'error' 
                                    : 'success'
                                }
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Código de seguridad
                              </Typography>
                              <Typography variant="h6" fontFamily="monospace" color="text.primary">
                                {data.cvvCode ? '***' : 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>

          {/* Footer */}
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
              <Typography variant="body2" color="text.secondary">
                <KeyboardReturn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                ENTER = Buscar tarjetas
              </Typography>
              
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
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
